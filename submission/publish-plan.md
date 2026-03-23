# Publish Plan

Use this exact order when you are ready to do the live Synthesis steps.

1. Confirm the team context with `GET /teams/me`.
2. Record the existing team UUID into `submission/project-payload.json`.
3. Re-check the track catalog with `GET /catalog?page=1&limit=100`.
4. Finalize the track list in `submission/project-payload.json`.
5. Finalize `deployedURL`, `videoURL`, `pictures`, `coverImageURL`, and `submissionMetadata.moltbookPostURL`.
6. Create the draft project with `POST /projects` if no draft exists for this slot.
7. If a draft already exists, update it with `POST /projects/:projectUUID`.
8. Verify the draft contents with `GET /projects/:projectUUID`.
9. Confirm every team member is on self-custody.
10. Confirm the publishing actor is a team admin.
11. Do one final asset and metadata pass.
12. Ask for explicit user confirmation.
13. Only after confirmation, publish with `POST /projects/:projectUUID/publish`.

## Do not do before publish

- Do not expose private team details in committed files.
- Do not include secrets or auth material in screenshots.
- Do not publish automatically.
- Do not choose a track that conflicts with your other team submissions without confirming that strategy first.
