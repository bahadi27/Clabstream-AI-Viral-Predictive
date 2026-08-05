# Security Specification & Test Harness

## 1. Data Invariants
- Users can only read and write their own profile document (`/users/{userId}`).
- An analysis document created under `/users/{userId}/analyses/{analysisId}` must have `userId == request.auth.uid`.
- Shared analyses in `/analyses/{analysisId}` can be read by any signed-in user, but created/updated/deleted only by the creator (`userId == request.auth.uid`).
- Non-signed in users cannot read or write private user data.

## 2. Dirty Dozen Payloads (Rejection Targets)
1. Unauthenticated user trying to read `/users/user123`.
2. User `userA` attempting to write to `/users/userB`.
3. User `userA` attempting to create `/users/userA/analyses/analysis1` with `userId = "userB"`.
4. User attempting to insert 100KB junk strings into `id`.
5. User attempting to delete another user's analysis record.
6. Shadow update injecting administrative claims into user document.
7. Modifying immutable `created_at` timestamp.
8. Unauthenticated read on `/analyses/{analysisId}`.
9. Attempting to update `userId` field after document creation.
10. Spoofed user token without verified email attempting write.
11. Injecting arbitrary unexpected fields outside of allowed keys.
12. Attempting to blanket query all user collections without specifying `userId`.
