import express, { Request, Response, NextFunction } from 'express';
import crypto from 'node:crypto';
import { db, hashPassword, verifyPassword } from './db.js';
import type { User, UserRole, JobStatus, ApplicationStatus } from './types.js';

export const apiRouter = express.Router();

// Extend Request type to hold authenticated user
export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Middleware: Authenticate Session Token
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentification requise.' });
    return;
  }

  const token = authHeader.substring(7).trim();
  const session = db.findSession(token);
  if (!session) {
    res.status(401).json({ error: 'Session expirée ou invalide. Veuillez vous reconnecter.' });
    return;
  }

  const user = db.findUserById(session.userId);
  if (!user || !user.isActive) {
    res.status(403).json({ error: 'Compte inactif ou introuvable.' });
    return;
  }

  req.user = user;
  next();
}

// Middleware: Require Admin Role
export function requireAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({ error: 'Accès interdit. Droits administrateur requis.' });
      return;
    }
    next();
  });
}

// Optional Auth (for public job endpoints to detect if candidate already applied)
export function optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const session = db.findSession(token);
    if (session) {
      const user = db.findUserById(session.userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }
  }
  next();
}

// ==========================================
// 1. AUTH ROUTES
// ==========================================

// Register as Candidate
apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password) {
      res.status(400).json({ error: 'Tous les champs obligatoires doivent être renseignés.' });
      return;
    }

    if (password.length < 8) {
      res.status(400).json({ error: 'Le mot de passe doit comporter au moins 8 caractères.' });
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      res.status(400).json({ error: 'Les deux mots de passe ne correspondent pas.' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Adresse email invalide.' });
      return;
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'Un compte existe déjà avec cette adresse email.' });
      return;
    }

    const { hash, salt } = hashPassword(password);
    const newUser: User = {
      id: 'usr_' + crypto.randomBytes(8).toString('hex'),
      role: 'CANDIDATE',
      email: email.trim().toLowerCase(),
      passwordHash: hash,
      salt,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    db.createUser(newUser);

    // Initialize an empty candidate profile
    db.upsertProfile(newUser.id, {
      country: 'France',
      chatterExperience: 'Débutant',
      languages: [{ language: 'Français', level: 'Courant' }],
    });

    const session = db.createSession(newUser.id);

    res.status(201).json({
      token: session.token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Une erreur est survenue lors de l’inscription.' });
  }
});

// Login
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email et mot de passe requis.' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Identifiants incorrects.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ error: 'Ce compte a été suspendu par un administrateur.' });
      return;
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      res.status(401).json({ error: 'Identifiants incorrects.' });
      return;
    }

    const session = db.createSession(user.id);

    res.json({
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Erreur lors de la connexion.' });
  }
});

// Me (Current authenticated user)
apiRouter.get('/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  res.json({
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

// Logout
apiRouter.post('/auth/logout', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const authHeader = req.headers.authorization!;
  const token = authHeader.substring(7).trim();
  db.deleteSession(token);
  res.json({ success: true, message: 'Déconnexion réussie.' });
});

// ==========================================
// 2. CANDIDATE PROFILE
// ==========================================

apiRouter.get('/profile/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role !== 'CANDIDATE') {
    res.status(403).json({ error: 'Seuls les candidats ont un profil candidat.' });
    return;
  }

  let profile = db.getProfileByUserId(user.id);
  if (!profile) {
    profile = db.upsertProfile(user.id, {});
  }

  res.json({ profile, user });
});

apiRouter.put('/profile/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    if (user.role !== 'CANDIDATE') {
      res.status(403).json({ error: 'Action réservée aux candidats.' });
      return;
    }

    const {
      country,
      city,
      ageRange,
      chatterExperience,
      experienceLevel,
      languages,
      availability,
      timezone,
      timeSlots,
      workType,
      bio,
      skills,
      workExperience,
      firstName,
      lastName,
    } = req.body;

    // Update names if provided
    if (firstName || lastName) {
      db.updateUser(user.id, {
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
      });
    }

    const updatedProfile = db.upsertProfile(user.id, {
      country,
      city,
      ageRange,
      chatterExperience,
      experienceLevel,
      languages,
      availability,
      timezone,
      timeSlots,
      workType,
      bio,
      skills,
      workExperience,
    });

    res.json({ success: true, profile: updatedProfile });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du profil.' });
  }
});

// ==========================================
// 3. PUBLIC / CANDIDATE JOBS
// ==========================================

// List published jobs with query filters
apiRouter.get('/jobs', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    let jobs = db.getPublishedJobs();

    const { search, language, experience, beginnerFriendly, workType, sort } = req.query;

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (language && typeof language === 'string' && language !== 'all') {
      jobs = jobs.filter((j) => j.languages.some((l) => l.toLowerCase() === language.toLowerCase()));
    }

    if (experience && typeof experience === 'string' && experience !== 'all') {
      jobs = jobs.filter((j) => j.requiredExperience === experience);
    }

    if (beginnerFriendly === 'true') {
      jobs = jobs.filter((j) => j.beginnerFriendly === true);
    }

    if (workType && typeof workType === 'string' && workType !== 'all') {
      jobs = jobs.filter((j) => j.workType.toLowerCase().includes(workType.toLowerCase()));
    }

    // Sort
    if (sort === 'oldest') {
      jobs.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      // Default newest
      jobs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    // If candidate logged in, map application flags
    const candidateId = req.user?.role === 'CANDIDATE' ? req.user.id : null;
    const mapped = jobs.map((j) => {
      let candidateApplied = false;
      let candidateStatus: ApplicationStatus | null = null;
      if (candidateId) {
        const app = db.findApplication(j.id, candidateId);
        if (app) {
          candidateApplied = true;
          candidateStatus = app.status;
        }
      }
      return {
        ...j,
        candidateApplied,
        candidateStatus,
      };
    });

    res.json({ jobs: mapped });
  } catch (err) {
    console.error('Fetch jobs error:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des offres.' });
  }
});

// Get single job detail
apiRouter.get('/jobs/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const job = db.getJobById(id);

  if (!job) {
    res.status(404).json({ error: 'Offre introuvable.' });
    return;
  }

  // Non-admins cannot see DRAFT jobs
  if (job.status === 'DRAFT' && req.user?.role !== 'ADMIN') {
    res.status(404).json({ error: 'Offre non disponible.' });
    return;
  }

  let userApplication: any = null;
  if (req.user?.role === 'CANDIDATE') {
    const app = db.findApplication(job.id, req.user.id);
    if (app) {
      userApplication = {
        id: app.id,
        status: app.status,
        createdAt: app.createdAt,
      };
    }
  }

  res.json({
    job,
    userApplication,
    isClosed: job.status === 'CLOSED',
  });
});

// ==========================================
// 4. CANDIDATE APPLICATIONS & DASHBOARD
// ==========================================

// Apply to a job
apiRouter.post('/jobs/:id/apply', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    if (user.role !== 'CANDIDATE') {
      res.status(403).json({ error: 'Seul un candidat peut postuler à une offre.' });
      return;
    }

    const { id: jobId } = req.params;
    const job = db.getJobById(jobId);

    if (!job) {
      res.status(404).json({ error: 'Offre introuvable.' });
      return;
    }

    if (job.status !== 'PUBLISHED') {
      res.status(400).json({ error: 'Cette offre n’accepte plus de candidatures (fermée ou en brouillon).' });
      return;
    }

    const existingApp = db.findApplication(jobId, user.id);
    if (existingApp) {
      res.status(409).json({ error: 'Vous avez déjà postulé à cette offre.' });
      return;
    }

    const { motivation, relevantExperience, availabilityNote, additionalNote } = req.body;

    if (!motivation || motivation.trim().length < 20) {
      res.status(400).json({ error: 'Veuillez saisir un message de motivation d’au moins 20 caractères.' });
      return;
    }

    const profile = db.getProfileByUserId(user.id);

    const candidateSnapshot = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      chatterExperience: profile?.chatterExperience || 'Débutant',
      languages: profile?.languages || [{ language: 'Français', level: 'Courant' }],
      country: profile?.country || 'Non renseigné',
      city: profile?.city || 'Non renseigné',
      availability: profile?.availability || availabilityNote || 'Non renseigné',
    };

    const newApplication = db.createApplication({
      jobId,
      candidateId: user.id,
      motivation: motivation.trim(),
      relevantExperience: relevantExperience?.trim() || '',
      availabilityNote: availabilityNote?.trim() || '',
      additionalNote: additionalNote?.trim() || '',
      candidateSnapshot,
    });

    res.status(201).json({
      success: true,
      application: newApplication,
      message: 'Votre candidature a bien été transmise à l’administrateur ChatterLink.',
    });
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ error: 'Erreur lors de l’envoi de votre candidature.' });
  }
});

// Candidate: List my applications
apiRouter.get('/candidate/applications', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role !== 'CANDIDATE') {
    res.status(403).json({ error: 'Action réservée aux candidats.' });
    return;
  }

  const applications = db.getApplicationsByCandidate(user.id);

  // Join job info
  const enriched = applications.map((app) => {
    const job = db.getJobById(app.jobId);
    return {
      ...app,
      job: job
        ? {
            id: job.id,
            title: job.title,
            compensation: job.compensation,
            status: job.status,
            workingHours: job.workingHours,
            workType: job.workType,
          }
        : null,
    };
  });

  res.json({ applications: enriched });
});

// Candidate Dashboard overview stats & recommendations
apiRouter.get('/candidate/dashboard', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  if (user.role !== 'CANDIDATE') {
    res.status(403).json({ error: 'Action réservée aux candidats.' });
    return;
  }

  const applications = db.getApplicationsByCandidate(user.id);
  const profile = db.getProfileByUserId(user.id);

  const total = applications.length;
  const sent = applications.filter((a) => a.status === 'RECEIVED').length;
  const reviewing = applications.filter((a) => a.status === 'REVIEWING').length;
  const shortlisted = applications.filter((a) => a.status === 'SHORTLISTED').length;
  const accepted = applications.filter((a) => a.status === 'ACCEPTED').length;
  const rejected = applications.filter((a) => a.status === 'REJECTED').length;

  // Recommended published jobs
  const appliedJobIds = new Set(applications.map((a) => a.jobId));
  const publishedJobs = db.getPublishedJobs().filter((j) => !appliedJobIds.has(j.id));

  // Simple recommendations based on experience
  let recommendations = publishedJobs;
  if (profile?.chatterExperience === 'Débutant') {
    recommendations = publishedJobs.filter((j) => j.beginnerFriendly);
  }

  res.json({
    stats: {
      total,
      pending: sent + reviewing,
      shortlisted,
      accepted,
      rejected,
    },
    profileCompleted: !!(profile && profile.bio && profile.skills && profile.skills.length > 0),
    recommendedJobs: recommendations.slice(0, 3),
  });
});

// ==========================================
// 5. ADMIN MANAGEMENT ROUTES
// ==========================================

// Admin overview stats
apiRouter.get('/admin/stats', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const stats = db.getAdminStats();
  res.json({ stats });
});

// Admin: List all jobs
apiRouter.get('/admin/jobs', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const jobs = db.getAllJobs();
  const enriched = jobs.map((job) => {
    const apps = db.getApplicationsByJob(job.id);
    return {
      ...job,
      applicantCount: apps.length,
      pendingCount: apps.filter((a) => a.status === 'RECEIVED' || a.status === 'REVIEWING').length,
    };
  });
  res.json({ jobs: enriched });
});

// Admin: Create job
apiRouter.post('/admin/jobs', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      title,
      description,
      missions,
      requiredProfile,
      requiredSkills,
      languages,
      requiredExperience,
      beginnerFriendly,
      availability,
      workingHours,
      compensation,
      compensationPublic,
      workType,
      openingsCount,
      additionalInfo,
      status,
    } = req.body;

    if (!title || !description || !missions) {
      res.status(400).json({ error: 'Titre, description et missions sont obligatoires.' });
      return;
    }

    const job = db.createJob({
      adminId: user.id,
      title: title.trim(),
      description: description.trim(),
      missions: missions.trim(),
      requiredProfile: requiredProfile?.trim() || '',
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : [],
      languages: Array.isArray(languages) && languages.length > 0 ? languages : ['Français'],
      requiredExperience: requiredExperience || 'Débutant',
      beginnerFriendly: beginnerFriendly === true,
      availability: availability?.trim() || 'Temps partiel',
      workingHours: workingHours?.trim() || 'Horaires flexibles',
      compensation: compensation?.trim() || 'Rémunération attractive',
      compensationPublic: compensationPublic !== false,
      workType: workType?.trim() || 'Télétravail 100%',
      openingsCount: openingsCount ? parseInt(openingsCount) : 1,
      additionalInfo: additionalInfo?.trim() || '',
      status: (status as JobStatus) || 'DRAFT',
      isDemo: false,
    });

    res.status(201).json({ success: true, job });
  } catch (err) {
    console.error('Create job error:', err);
    res.status(500).json({ error: 'Erreur lors de la création de l’offre.' });
  }
});

// Admin: Update job
apiRouter.put('/admin/jobs/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const existing = db.getJobById(id);
    if (!existing) {
      res.status(404).json({ error: 'Offre introuvable.' });
      return;
    }

    const updated = db.updateJob(id, req.body);
    res.json({ success: true, job: updated });
  } catch (err) {
    console.error('Update job error:', err);
    res.status(500).json({ error: 'Erreur lors de la modification de l’offre.' });
  }
});

// Admin: Quick status change (DRAFT, PUBLISHED, CLOSED)
apiRouter.patch('/admin/jobs/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['DRAFT', 'PUBLISHED', 'CLOSED'].includes(status)) {
      res.status(400).json({ error: 'Statut invalide.' });
      return;
    }

    const updated = db.updateJob(id, { status: status as JobStatus });
    if (!updated) {
      res.status(404).json({ error: 'Offre introuvable.' });
      return;
    }

    res.json({ success: true, job: updated });
  } catch (err) {
    console.error('Change job status error:', err);
    res.status(500).json({ error: 'Erreur lors de la modification du statut.' });
  }
});

// Admin: Delete job
apiRouter.delete('/admin/jobs/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.deleteJob(id);
    if (!success) {
      res.status(404).json({ error: 'Offre introuvable.' });
      return;
    }
    res.json({ success: true, message: 'Offre et candidatures associées supprimées.' });
  } catch (err) {
    console.error('Delete job error:', err);
    res.status(500).json({ error: 'Erreur lors de la suppression de l’offre.' });
  }
});

// Admin: List all applications with filtering
apiRouter.get('/admin/applications', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { jobId, status, search } = req.query;
    let apps = db.getAllApplications();

    if (jobId && typeof jobId === 'string' && jobId !== 'all') {
      apps = apps.filter((a) => a.jobId === jobId);
    }

    if (status && typeof status === 'string' && status !== 'all') {
      apps = apps.filter((a) => a.status === status);
    }

    const enriched = apps.map((app) => {
      const job = db.getJobById(app.jobId);
      const user = db.findUserById(app.candidateId);
      const profile = user ? db.getProfileByUserId(user.id) : null;
      return {
        ...app,
        job: job ? { id: job.id, title: job.title, status: job.status } : null,
        candidate: user
          ? {
              id: user.id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              isActive: user.isActive,
              profile,
            }
          : null,
      };
    });

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      const filtered = enriched.filter(
        (a) =>
          a.candidate?.firstName.toLowerCase().includes(q) ||
          a.candidate?.lastName.toLowerCase().includes(q) ||
          a.candidate?.email.toLowerCase().includes(q) ||
          a.job?.title.toLowerCase().includes(q)
      );
      res.json({ applications: filtered });
      return;
    }

    res.json({ applications: enriched });
  } catch (err) {
    console.error('Admin applications error:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des candidatures.' });
  }
});

// Admin: Update application status
apiRouter.patch('/admin/applications/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: ApplicationStatus[] = [
      'RECEIVED',
      'REVIEWING',
      'SHORTLISTED',
      'ACCEPTED',
      'REJECTED',
    ];

    if (!validStatuses.includes(status)) {
      res.status(400).json({ error: 'Statut de candidature invalide.' });
      return;
    }

    const updated = db.updateApplicationStatus(id, status);
    if (!updated) {
      res.status(404).json({ error: 'Candidature introuvable.' });
      return;
    }

    res.json({ success: true, application: updated });
  } catch (err) {
    console.error('Update app status error:', err);
    res.status(500).json({ error: 'Erreur lors de la mise à jour du statut.' });
  }
});

// Admin: List candidates
apiRouter.get('/admin/candidates', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  try {
    const candidates = db.getAllCandidates();
    const result = candidates.map((c) => {
      const profile = db.getProfileByUserId(c.id);
      const apps = db.getApplicationsByCandidate(c.id);
      return {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        email: c.email,
        isActive: c.isActive,
        createdAt: c.createdAt,
        profile,
        applicationCount: apps.length,
        acceptedCount: apps.filter((a) => a.status === 'ACCEPTED').length,
      };
    });
    res.json({ candidates: result });
  } catch (err) {
    console.error('List candidates error:', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des candidats.' });
  }
});

// Admin: Candidate details + full application history
apiRouter.get('/admin/candidates/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = db.findUserById(id);

  if (!user || user.role !== 'CANDIDATE') {
    res.status(404).json({ error: 'Candidat introuvable.' });
    return;
  }

  const profile = db.getProfileByUserId(user.id);
  const applications = db.getApplicationsByCandidate(user.id).map((app) => {
    const job = db.getJobById(app.jobId);
    return {
      ...app,
      jobTitle: job?.title || 'Offre supprimée',
    };
  });

  res.json({
    candidate: {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      createdAt: user.createdAt,
      profile,
      applications,
    },
  });
});

// Admin: Toggle candidate active state
apiRouter.patch('/admin/candidates/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = db.findUserById(id);
  if (!user || user.role !== 'CANDIDATE') {
    res.status(404).json({ error: 'Candidat introuvable.' });
    return;
  }

  const updated = db.updateUser(id, { isActive: !!isActive });
  res.json({ success: true, user: updated });
});
