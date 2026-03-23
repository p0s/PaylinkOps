# Manual Fallback

If the Synthesis API flow is unavailable, use the following files and values as the manual submission package:

- `submission/project-payload.json`
- `submission/submission-metadata.json`
- `submission/tracks.md`
- `submission/sponsor-notes.md`
- `submission/demo-script.md`
- `submission/checklist.md`
- `submission/known-context.md`
- `submission/missing-info.md`
- `submission/publish-plan.md`

The highest-signal file for unresolved inputs is:

- `submission/missing-info.md`

The main live values still expected before an actual publish are:

- final track decision if you do not want both documented tracks
- `deployedURL`
- `videoURL`
- `pictures`
- `coverImageURL`
- final screenshot and cover assets if you want polished judge-facing materials

The conversation log is already summarized in `submission/conversation-log.md`. Use the active session history only if you want a fuller transcript than the concise summary.
