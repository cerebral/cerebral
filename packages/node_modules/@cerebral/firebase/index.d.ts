export interface Config {
  apiKey: string
  authDomain: string
  databaseURL: string
  messagingSenderId: string
  projectId: string
  storageBucket: string
}

export interface ProviderOptions {
  config: Config
  queuePath?: string
  payload?: any
  specPrefix?: string
}

export default function Provider(opts: ProviderOptions): any

export interface FirebaseUser {
  displayName: string | null
  email: string
  emailVerified: boolean
  isAnonymous: boolean
  photoURL: string | null
  providerData: {
    displayName: string | null
    email: string
    providerId: string
    uid: string // email, facebook, etc
  } & any
  uid: string
}

type UserPromise = Promise<{ user: FirebaseUser }>

export interface OnChildOptions<T = any> {
  endAt?: number
  equalTo?: number
  limitToFirst?: number
  limitToLast?: number
  orderByChild?: string
  orderByKey?: boolean
  orderByValue?: boolean
  payload?: T
  startAt?: number
}

export interface OnValueOptions<T = any> {
  payload?: T
}

export interface ProgressPayload {
  bytesTransferred: number
  progress: number
  state: 'paused' | 'running'
  totalBytes: number
}

export interface PutOptions<T = any> {
  payload?: T
  // state or signal
  progress?: (payload: ProgressPayload & T) => void
}

export interface TransformFunction {
  (currentData: any): any
}

export interface FirebaseProvider {
  cancelOnDisconnect(): void
  createUserWithEmailAndPassword(email: string, password: string): UserPromise
  deleteFile(path: string, filename: string): Promise<void>
  deleteUser(password: string): Promise<void>
  getUser(): UserPromise
  linkWithFacebook(
    options: { redirect?: boolean; scopes: string[] } & any
  ): UserPromise
  linkWithGithub(options: { redirect?: boolean } & any): UserPromise
  linkWithGoogle(options: { redirect?: boolean } & any): UserPromise
  off(path: string, event?: string): void
  onChildAdded(path: string, signalPath: string, opts?: OnChildOptions): void
  onChildChanged(path: string, signalPath: string, opts?: OnChildOptions): void
  onChildRemoved(path: string, signalPath: string, opts?: OnChildOptions): void
  onValue(path: string, signalPath: string, opts?: OnValueOptions): void
  push(path: string, child: any): Promise<{ key: string }>
  put(
    path: string,
    file: any,
    opts?: PutOptions
  ): Promise<{ url: string; filename: string }>
  remove(path: string): Promise<void>
  sendPasswordResetEmail(email: string): Promise<void>
  set(path: string, value: any): Promise<void>
  setOnDisconnect(localPath: string, value: any): void
  signInAnonymously(): UserPromise
  signInWithCustomToken(token: string): UserPromise
  signInWithEmailAndPassword(email: string, password: string): UserPromise
  signInWithFacebook(
    opts: { redirect?: boolean; scopes: string[] } & any
  ): UserPromise
  signInWithGithub(opts: { redirect?: boolean } & any): UserPromise
  signInWithGoogle(opts: { redirect?: boolean } & any): UserPromise
  signOut(): void
  task(taskName: string, payload: any): Promise<void>
  transaction(
    path: string,
    transformer: TransformFunction
  ): Promise<{ committed: any; value: any }>
  update(path: string, partial: any): Promise<void>
  value<T = any>(path: string): Promise<{ key: string; value: T }>
}
