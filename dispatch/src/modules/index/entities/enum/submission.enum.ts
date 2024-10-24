export enum SubmissionLanguage {
    LANGUAGE_C = 0,
    LANGUAGE_CPP = 1,
    LANGUAGE_JAVASCRIPT = 2,
}

export enum SubmissionStatus {
    STATUS_PENDING = -1,
    STATUS_ACCEPTED = 0,
    STATUS_COMPILATION_ERROR = 1,
    STATUS_RUNTIME_ERROR = 2,
    STATUS_TIME_LIMIT_EXCEEDED = 3,
    STATUS_MEMORY_LIMIT_EXCEEDED = 4,
    STATUS_WRONG_ANSWER = 5,
    STATUS_INTERNAL_ERROR = 6,
}