import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type {
  User,
  CandidateProfile,
  Job,
  Application,
  Session,
  UserRole,
  JobStatus,
  ApplicationStatus,
} from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

export interface DatabaseSchema {
  users: User[];
  profiles: CandidateProfile[];
  jobs: Job[];
  applications: Application[];
  sessions: Session[];
}

export function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, chosenSalt, 64).toString('hex');
  return { hash, salt: chosenSalt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const calculated = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(calculated, 'hex'));
}

class RelationalDatabase {
  private data: DatabaseSchema = {
    users: [],
    profiles: [],
    jobs: [],
    applications: [],
    sessions: [],
  };

  constructor() {
    this.load();
  }

  private load() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure arrays exist
        this.data.users = this.data.users || [];
        this.data.profiles = this.data.profiles || [];
        this.data.jobs = this.data.jobs || [];
        this.data.applications = this.data.applications || [];
        this.data.sessions = this.data.sessions || [];
      } else {
        this.seedInitialData();
        this.save();
      }
    } catch (err) {
      console.error('Error loading database, re-seeding...', err);
      this.seedInitialData();
      this.save();
    }
  }

  public save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database file', err);
    }
  }

  private seedInitialData() {
    console.log('[Database] Seeding initial demonstrative data...');

    // 1. Admin User
    const adminAuth = hashPassword('Admin2026!');
    const adminUser: User = {
      id: 'usr_admin_master',
      role: 'ADMIN',
      email: 'admin@chatterlink.pro',
      passwordHash: adminAuth.hash,
      salt: adminAuth.salt,
      firstName: 'Alexandre',
      lastName: 'Dubois',
      isActive: true,
      createdAt: '2026-09-01T08:00:00.000Z',
    };

    // 2. Demo Candidate User
    const candidateAuth = hashPassword('Chatter2026!');
    const candidateUser: User = {
      id: 'usr_cand_camille',
      role: 'CANDIDATE',
      email: 'camille.d@example.com',
      passwordHash: candidateAuth.hash,
      salt: candidateAuth.salt,
      firstName: 'Camille',
      lastName: 'Dufresne',
      isActive: true,
      createdAt: '2026-09-15T10:30:00.000Z',
    };

    const candidateProfile: CandidateProfile = {
      id: 'prof_camille',
      userId: candidateUser.id,
      country: 'France',
      city: 'Lyon',
      ageRange: '25-34',
      chatterExperience: 'Moins de 6 mois',
      experienceLevel: 'Intermédiaire',
      languages: [
        { language: 'Français', level: 'Bilingue / Natif' },
        { language: 'Anglais', level: 'Courant' },
      ],
      availability: 'Temps partiel (20-30h / semaine)',
      timezone: 'UTC+1 (Paris)',
      timeSlots: 'Soirée (18h-00h) et week-ends',
      workType: 'Télétravail 100%',
      bio: "Passionnée par le marketing relationnel et la communication digitale. J'ai une excellente réactivité par écrit, une orthographe irréprochable et un grand sens de l'empathie pour créer des liens de confiance avec les abonnés.",
      skills: [
        'Excellente orthographe et syntaxe',
        'Vente douce et conversion personnalisée',
        'Gestion des objections',
        'Respect strict de la confidentialité',
        'Disponibilité soirée',
      ],
      workExperience:
        '3 mois de chatter pour un créateur de contenu voyage, et 2 ans en support client relationnel par chat.',
      updatedAt: '2026-09-18T14:20:00.000Z',
    };

    // 3. Demo Jobs (Realistic offers clearly tagged isDemo: true)
    const now = new Date().toISOString();
    const jobs: Job[] = [
      {
        id: 'job_lifestyle_fr_01',
        adminId: adminUser.id,
        title: 'Chatter Débutant(e) Motivé(e) · Créatrice Lifestyle & Mode',
        description:
          "Une créatrice de contenu établie dans l'univers mode et lifestyle recherche 2 chatters dynamiques pour animer sa communauté francophone. Aucune expérience préalable en chatter n'est obligatoire : un accompagnement avec script et consignes claires est fourni pour démarrer.",
        missions:
          "· Répondre aux messages entrants des abonnés avec authenticité et courtoisie.\n· Développer des conversations engageantes et valoriser les contenus exclusifs.\n· Respecter la ligne éditoriale et le ton bienveillant de la créatrice.\n· Remonter les retours récurrents de la communauté à l'équipe.",
        requiredProfile:
          "Nous recherchons avant tout une personne motivée, avec une orthographe impeccable en français, un bon sens de la psychologie et une grande discrétion.",
        requiredSkills: [
          'Orthographe française irréprochable',
          'Aisance relationnelle à l’écrit',
          'Sérieux et ponctualité',
          'Connexion internet stable',
        ],
        languages: ['Français'],
        requiredExperience: 'Débutant',
        beginnerFriendly: true,
        availability: 'Temps partiel (15h à 20h / semaine)',
        workingHours: 'Créneaux en fin d’après-midi ou début de soirée (17h - 22h)',
        compensation: 'Fixe garanti + 12% de commission (est. 1 400 € – 2 200 € / mois)',
        compensationPublic: true,
        workType: 'Télétravail 100%',
        openingsCount: 2,
        additionalInfo:
          'Formation initiale de 3 jours offerte. Matériel informatique requis (PC ou tablette récents). Offre reçue et vérifiée par l’administrateur ChatterLink.',
        status: 'PUBLISHED',
        isDemo: true,
        createdAt: '2026-09-20T09:00:00.000Z',
        publishedAt: '2026-09-20T09:00:00.000Z',
      },
      {
        id: 'job_fitness_bilingual_02',
        adminId: adminUser.id,
        title: 'Chatter Bilingue FR / EN · Créatrice Fitness & Wellness',
        description:
          'Créatrice certifiée fitness avec une audience internationale en forte croissance recherche un(e) chatter bilingue pour gérer les interactions privées et les conseils personnalisés aux abonnés.',
        missions:
          '· Gestion du flux de messagerie en français et en anglais.\n· Présentation et vente des programmes de coaching exclusifs.\n· Suivi attentif des demandes des fans VIP.\n· Tenue du tableau de bord quotidien des échanges.',
        requiredProfile:
          'Profil ayant déjà une première expérience réussie en chatter ou en relation client par écrit. Capacité à switcher facilement entre l’anglais et le français.',
        requiredSkills: [
          'Bilingue Français / Anglais fluide',
          'Expérience préalable en messagerie ou vente',
          'Sens de la persuasion et closing',
          'Rapidité de frappe',
        ],
        languages: ['Français', 'Anglais'],
        requiredExperience: 'Moins de 6 mois',
        beginnerFriendly: false,
        availability: 'Temps plein ou partiel (25h à 35h / semaine)',
        workingHours: 'Créneau 18h - 00h (heure de Paris)',
        compensation: 'Fixe 1 200 € + 15% de commission sur ventes (est. 2 500 € – 4 000 €)',
        compensationPublic: true,
        workType: 'Télétravail 100%',
        openingsCount: 1,
        additionalInfo:
          'Fort volume d’échanges. Prime mensuelle sur objectifs de conversion atteinte. Offre vérifiée par ChatterLink.',
        status: 'PUBLISHED',
        isDemo: true,
        createdAt: '2026-09-22T11:30:00.000Z',
        publishedAt: '2026-09-22T11:30:00.000Z',
      },
      {
        id: 'job_night_gaming_03',
        adminId: adminUser.id,
        title: 'Chatter Créneaux Nuit & Week-ends · Univers Cosplay & Gaming',
        description:
          'Créatrice active dans le streaming gaming et cosplay cherche un chatter pour couvrir les créneaux nocturnes à fort engagement. Idéal pour profil autonome et habitué aux horaires décalés.',
        missions:
          '· Assurer la présence et le chat pendant les heures nocturnes.\n· Répondre avec réactivité aux abonnés fidèles et abonnés noctambules.\n· Valorisation des packs média exclusifs.\n· Respect des consignes de sécurité et de modération.',
        requiredProfile:
          'Débutant accepté si passionné(e) par la culture internet / gaming et doté(e) d’une excellente écoute.',
        requiredSkills: [
          'Affinité avec le milieu streaming / gaming',
          'Rythme nocturne régulier',
          'Empathie et bienveillance',
          'Rigueur',
        ],
        languages: ['Français'],
        requiredExperience: 'Débutant',
        beginnerFriendly: true,
        availability: '20h à 25h / semaine',
        workingHours: 'Nuit (23h00 - 05h00) du jeudi au dimanche',
        compensation: 'Tarif horaire majoré nuit + commissions (est. 1 800 € – 2 600 € / mois)',
        compensationPublic: true,
        workType: 'Télétravail 100%',
        openingsCount: 1,
        additionalInfo:
          'Ambiance de travail détendue mais exigence stricte de ponctualité sur les créneaux nocturnes.',
        status: 'PUBLISHED',
        isDemo: true,
        createdAt: '2026-09-25T14:15:00.000Z',
        publishedAt: '2026-09-25T14:15:00.000Z',
      },
      {
        id: 'job_luxury_senior_04',
        adminId: adminUser.id,
        title: 'Chatter Senior / Closer Haut Panier · Créatrice Voyage & Luxe',
        description:
          'Pour un compte à très forte notoriété et clientèle VIP à fort pouvoir d’achat, nous recherchons un profil expérimenté capable de gérer des conversations à haute valeur ajoutée avec un ton élégant et raffiné.',
        missions:
          '· Gestion des relations privilégiées avec les membres du club VIP.\n· Vente de contenus sur-mesure et d’expériences personnalisées.\n· Analyse des profils et personnalisation chirurgicale des messages.\n· Reporting quotidien des performances.',
        requiredProfile:
          'Minimum 1 an d’expérience avérée en chatter ou vente haut de gamme. Excellente culture générale et tact irréprochable.',
        requiredSkills: [
          'Expérience 1 an+ en chatter prouvée',
          'Psychologie de vente avancée',
          'Secret professionnel et discrétion totale',
          'Gestion de crise et modération fine',
        ],
        languages: ['Français', 'Anglais'],
        requiredExperience: '1 à 2 ans',
        beginnerFriendly: false,
        availability: 'Temps plein (35h / semaine)',
        workingHours: 'Planning rotatif avec repos en semaine',
        compensation: '20% de commission sans plafond (revenus observés > 3 500 € / mois)',
        compensationPublic: true,
        workType: 'Télétravail 100%',
        openingsCount: 1,
        additionalInfo:
          'Période d’essai rémunérée de 2 semaines. Validation directe par l’administrateur après entretien écrit.',
        status: 'PUBLISHED',
        isDemo: true,
        createdAt: '2026-09-28T16:00:00.000Z',
        publishedAt: '2026-09-28T16:00:00.000Z',
      },
      {
        id: 'job_afternoon_05',
        adminId: adminUser.id,
        title: 'Chatter Après-midi (13h-19h) · Créatrice Beauté & Conseils',
        description:
          'Créatrice francophone recherche un chatter attentif et régulier pour gérer les interactions d’après-midi. Formation assurée sur la voix et le style de communication de la créatrice.',
        missions:
          '· Réponses bienveillantes aux questions beauté et bien-être.\n· Animation du flux de stories privées.\n· Partage des offres spéciales en direct.',
        requiredProfile:
          'Débutant accepté. Personne douce, rigoureuse et disponible en semaine de 13h à 19h.',
        requiredSkills: [
          'Orthographe soignée',
          'Disponibilité en semaine',
          'Sens du détail',
        ],
        languages: ['Français'],
        requiredExperience: 'Débutant',
        beginnerFriendly: true,
        availability: '30h / semaine',
        workingHours: '13h00 - 19h00 du lundi au vendredi',
        compensation: 'Rémunération fixe 1 500 € + primes de performance',
        compensationPublic: true,
        workType: 'Télétravail 100%',
        openingsCount: 1,
        additionalInfo: 'Contrat renouvelable sur le long terme.',
        status: 'PUBLISHED',
        isDemo: true,
        createdAt: '2026-10-01T08:30:00.000Z',
        publishedAt: '2026-10-01T08:30:00.000Z',
      },
      {
        id: 'job_draft_06',
        adminId: adminUser.id,
        title: '[Brouillon] Chatter Spécialisé Événements Saisonniers',
        description:
          'Offre en cours de préparation avec la créatrice. Attente de la validation finale des créneaux horaires et du modèle de commissionnement.',
        missions: 'Animation durant les lancements saisonniers.',
        requiredProfile: 'Profil réactif.',
        requiredSkills: ['Adaptabilité'],
        languages: ['Français'],
        requiredExperience: 'Moins de 6 mois',
        beginnerFriendly: true,
        availability: '15h / semaine',
        workingHours: 'À définir',
        compensation: 'En cours de négociation',
        compensationPublic: false,
        workType: 'Télétravail',
        openingsCount: 1,
        additionalInfo: 'Brouillon interne admin.',
        status: 'DRAFT',
        isDemo: true,
        createdAt: '2026-10-05T10:00:00.000Z',
      },
    ];

    // 4. Demo Application
    const applications: Application[] = [
      {
        id: 'app_demo_01',
        jobId: 'job_lifestyle_fr_01',
        candidateId: candidateUser.id,
        status: 'SHORTLISTED',
        motivation:
          "Bonjour ! Je suis très enthousiaste à l'idée de collaborer avec cette créatrice. J'apprécie beaucoup son univers lifestyle et je sais me fondre parfaitement dans son style de communication. J'ai une orthographe irréprochable et je suis disponible immédiatement sur les créneaux de fin de journée.",
        relevantExperience:
          '3 mois de gestion de chat pour un créateur et 2 ans de relation client par écrit.',
        availabilityNote: 'Disponible 20h/semaine dès aujourd’hui (17h - 22h).',
        additionalNote: 'Connexion fibre optique et double écran pour une réactivité maximale.',
        candidateSnapshot: {
          firstName: candidateUser.firstName,
          lastName: candidateUser.lastName,
          email: candidateUser.email,
          chatterExperience: candidateProfile.chatterExperience,
          languages: candidateProfile.languages,
          country: candidateProfile.country,
          city: candidateProfile.city,
          availability: candidateProfile.availability,
        },
        createdAt: '2026-09-21T10:15:00.000Z',
        updatedAt: '2026-09-22T08:00:00.000Z',
      },
    ];

    this.data = {
      users: [adminUser, candidateUser],
      profiles: [candidateProfile],
      jobs,
      applications,
      sessions: [],
    };
  }

  // --- Users & Auth ---
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  public getAllCandidates(): User[] {
    return this.data.users.filter((u) => u.role === 'CANDIDATE');
  }

  public createUser(user: User): User {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>): User | undefined {
    const user = this.findUserById(id);
    if (!user) return undefined;
    Object.assign(user, updates);
    this.save();
    return user;
  }

  // --- Sessions ---
  public createSession(userId: string): Session {
    const token = 'tok_' + crypto.randomBytes(32).toString('hex');
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    const session: Session = {
      token,
      userId,
      createdAt: now.toISOString(),
      expiresAt,
    };

    this.data.sessions.push(session);
    this.save();
    return session;
  }

  public findSession(token: string): Session | undefined {
    const session = this.data.sessions.find((s) => s.token === token);
    if (!session) return undefined;
    if (new Date(session.expiresAt) < new Date()) {
      // Expired
      this.deleteSession(token);
      return undefined;
    }
    return session;
  }

  public deleteSession(token: string): void {
    this.data.sessions = this.data.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // --- Profiles ---
  public getProfileByUserId(userId: string): CandidateProfile | undefined {
    return this.data.profiles.find((p) => p.userId === userId);
  }

  public upsertProfile(userId: string, profileData: Partial<CandidateProfile>): CandidateProfile {
    const existing = this.getProfileByUserId(userId);
    if (existing) {
      Object.assign(existing, profileData, { updatedAt: new Date().toISOString() });
      this.save();
      return existing;
    }

    const newProfile: CandidateProfile = {
      id: 'prof_' + crypto.randomBytes(8).toString('hex'),
      userId,
      country: profileData.country || '',
      city: profileData.city || '',
      ageRange: profileData.ageRange || '18-24',
      chatterExperience: profileData.chatterExperience || 'Débutant',
      experienceLevel: profileData.experienceLevel || 'Débutant',
      languages: profileData.languages || [{ language: 'Français', level: 'Courant' }],
      availability: profileData.availability || '',
      timezone: profileData.timezone || 'UTC+1 (Paris)',
      timeSlots: profileData.timeSlots || '',
      workType: profileData.workType || 'Télétravail 100%',
      bio: profileData.bio || '',
      skills: profileData.skills || [],
      workExperience: profileData.workExperience || '',
      updatedAt: new Date().toISOString(),
    };

    this.data.profiles.push(newProfile);
    this.save();
    return newProfile;
  }

  // --- Jobs ---
  public getAllJobs(): Job[] {
    return this.data.jobs;
  }

  public getPublishedJobs(): Job[] {
    return this.data.jobs.filter((j) => j.status === 'PUBLISHED');
  }

  public getJobById(id: string): Job | undefined {
    return this.data.jobs.find((j) => j.id === id);
  }

  public createJob(jobData: Omit<Job, 'id' | 'createdAt'>): Job {
    const job: Job = {
      ...jobData,
      id: 'job_' + crypto.randomBytes(8).toString('hex'),
      createdAt: new Date().toISOString(),
      publishedAt: jobData.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
    };
    this.data.jobs.unshift(job);
    this.save();
    return job;
  }

  public updateJob(id: string, updates: Partial<Job>): Job | undefined {
    const job = this.getJobById(id);
    if (!job) return undefined;

    if (updates.status === 'PUBLISHED' && job.status !== 'PUBLISHED' && !job.publishedAt) {
      job.publishedAt = new Date().toISOString();
    }
    if (updates.status === 'CLOSED' && job.status !== 'CLOSED') {
      job.closedAt = new Date().toISOString();
    }

    Object.assign(job, updates);
    this.save();
    return job;
  }

  public deleteJob(id: string): boolean {
    const initialLen = this.data.jobs.length;
    this.data.jobs = this.data.jobs.filter((j) => j.id !== id);
    // Also delete cascade applications
    this.data.applications = this.data.applications.filter((a) => a.jobId !== id);
    const deleted = this.data.jobs.length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  // --- Applications ---
  public getApplicationsByCandidate(candidateId: string): Application[] {
    return this.data.applications.filter((a) => a.candidateId === candidateId);
  }

  public getApplicationsByJob(jobId: string): Application[] {
    return this.data.applications.filter((a) => a.jobId === jobId);
  }

  public getAllApplications(): Application[] {
    return this.data.applications;
  }

  public getApplicationById(id: string): Application | undefined {
    return this.data.applications.find((a) => a.id === id);
  }

  public findApplication(jobId: string, candidateId: string): Application | undefined {
    return this.data.applications.find((a) => a.jobId === jobId && a.candidateId === candidateId);
  }

  public createApplication(data: {
    jobId: string;
    candidateId: string;
    motivation: string;
    relevantExperience: string;
    availabilityNote: string;
    additionalNote: string;
    candidateSnapshot: Application['candidateSnapshot'];
  }): Application {
    const application: Application = {
      id: 'app_' + crypto.randomBytes(8).toString('hex'),
      jobId: data.jobId,
      candidateId: data.candidateId,
      status: 'RECEIVED',
      motivation: data.motivation,
      relevantExperience: data.relevantExperience,
      availabilityNote: data.availabilityNote,
      additionalNote: data.additionalNote,
      candidateSnapshot: data.candidateSnapshot,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.applications.unshift(application);
    this.save();
    return application;
  }

  public updateApplicationStatus(id: string, status: ApplicationStatus): Application | undefined {
    const app = this.getApplicationById(id);
    if (!app) return undefined;
    app.status = status;
    app.updatedAt = new Date().toISOString();
    this.save();
    return app;
  }

  // --- Stats ---
  public getAdminStats() {
    const totalCandidates = this.data.users.filter((u) => u.role === 'CANDIDATE').length;
    const totalJobs = this.data.jobs.length;
    const publishedJobs = this.data.jobs.filter((j) => j.status === 'PUBLISHED').length;
    const draftJobs = this.data.jobs.filter((j) => j.status === 'DRAFT').length;
    const closedJobs = this.data.jobs.filter((j) => j.status === 'CLOSED').length;
    const totalApplications = this.data.applications.length;
    const pendingApplications = this.data.applications.filter(
      (a) => a.status === 'RECEIVED' || a.status === 'REVIEWING'
    ).length;
    const shortlistedApplications = this.data.applications.filter(
      (a) => a.status === 'SHORTLISTED'
    ).length;
    const acceptedApplications = this.data.applications.filter(
      (a) => a.status === 'ACCEPTED'
    ).length;

    return {
      totalCandidates,
      totalJobs,
      publishedJobs,
      draftJobs,
      closedJobs,
      totalApplications,
      pendingApplications,
      shortlistedApplications,
      acceptedApplications,
    };
  }
}

export const db = new RelationalDatabase();
