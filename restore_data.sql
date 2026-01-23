-- Restore data for HR App
-- Extracted from backup: db_cluster-02-08-2024@10-16-52.backup

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- Company data
COPY public."Company" (id, "createdAt", "updatedAt", name, size, logo, website) FROM stdin;
e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	2024-05-17 14:06:47.181	2024-07-03 01:06:40.247	Hometeam	med	https://kbsc0vz82ntz1jwx.public.blob.vercel-storage.com/logos/Hometeam/Frame%202-dTXQd6dNehxFt3zBDNcG19LoFP6wYK.png
595c8f88-8be5-46ff-a181-e61b5500cd49	2024-05-25 15:37:35.538	2024-07-07 19:03:35.502	Awayteam	med	https://kbsc0vz82ntz1jwx.public.blob.vercel-storage.com/logos/Awayteam/Frame%2013-XHgqSTIt5NTxG9VugBE2ZLIsrEYUoz.svg
\.

-- Team data
COPY public."Team" (id, "createdAt", "updatedAt", name, "companyId", logo) FROM stdin;
805245c8-b455-44a4-b69a-f3afa062338d	2024-05-17 14:06:47.308	2024-05-17 14:06:47.308	Sales	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	\N
95ebac16-7dac-4bca-8501-004e599c07d3	2024-05-17 14:06:47.308	2024-05-17 14:06:47.308	Marketing	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	\N
61f03585-a4d4-428e-969f-4a82723ed997	2024-05-17 14:06:47.308	2024-05-17 14:06:47.308	Engineering	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	\N
624ad468-98e9-475a-ba48-cd27c2e9d5ac	2024-05-17 14:06:47.308	2024-05-17 14:06:47.308	Product	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	\N
28e09153-9cdb-4091-859f-2f88ed812134	2024-05-25 15:37:35.737	2024-05-25 15:37:35.737	Sales	595c8f88-8be5-46ff-a181-e61b5500cd49	\N
e93753e5-a5a1-4e4b-b449-2490541fa590	2024-05-25 15:37:35.737	2024-05-25 15:37:35.737	Marketing	595c8f88-8be5-46ff-a181-e61b5500cd49	\N
d01f8e69-1f8d-44c8-a3c5-a6b5befcff4a	2024-05-25 15:37:35.737	2024-05-25 15:37:35.737	Engineering	595c8f88-8be5-46ff-a181-e61b5500cd49	\N
149aec6a-1693-41a5-b8d0-a40994899a10	2024-05-25 15:37:35.737	2024-05-25 15:37:35.737	Product	595c8f88-8be5-46ff-a181-e61b5500cd49	\N
\.

-- User data
COPY public."User" (id, "createdAt", "updatedAt", "clerkId", email, "isAdmin", "firstName", "lastName", role, "employmentStart", "employmentEnd", "availableForAcquisition", "companyId", "teamId", "profileImage", resume, "resumeSummary") FROM stdin;
26b359ec-c2ee-42d8-8e4c-d49170977040	2024-05-17 14:06:47.308	2024-05-17 14:06:47.308	\N	\N	\N	Sally	Doe	\N	\N	\N	f	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	805245c8-b455-44a4-b69a-f3afa062338d	\N	\N	\N
3809e3a9-c3e0-4d49-a017-f411262e807c	2024-05-17 14:06:47.308	2024-05-17 14:06:47.308	\N	\N	\N	Bob	Doe	\N	\N	\N	f	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	95ebac16-7dac-4bca-8501-004e599c07d3	\N	\N	\N
09ef4b6a-adc3-41e7-babd-67a9fd353d32	2024-05-17 14:06:47.308	2024-05-17 14:06:47.308	\N	\N	\N	Jane	Doe	\N	\N	\N	f	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	61f03585-a4d4-428e-969f-4a82723ed997	\N	\N	\N
867f4b9e-a8a2-41fd-acc4-cd5458334f24	2024-05-17 14:06:47.308	2024-05-17 14:06:47.308	\N	\N	\N	John	Doe	\N	\N	\N	f	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	624ad468-98e9-475a-ba48-cd27c2e9d5ac	\N	\N	\N
c88b5b94-713e-41c9-9f70-8e1f4bde5a0e	2024-05-17 14:06:42.564	2024-05-17 14:06:48.637	user_2gb8E7IX3Dl7VGQDXDNB4HH5XMt	morganpierson@gmail.com	\N	\N	\N	\N	\N	\N	f	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	\N	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yZ2I4RTE3alNmdlB2QXZ5SEQ5M1ZobTJOeEYifQ	\N	\N
cee6890c-ae44-4e8c-a5c6-6309bf41e561	2024-05-25 15:37:35.737	2024-05-25 15:37:35.737	\N	\N	\N	Sally	Doe	\N	\N	\N	f	595c8f88-8be5-46ff-a181-e61b5500cd49	28e09153-9cdb-4091-859f-2f88ed812134	\N	\N	\N
b764aa76-e0fc-45b2-9a29-0097e5db1834	2024-05-25 15:37:35.737	2024-05-25 15:37:35.737	\N	\N	\N	Bob	Doe	\N	\N	\N	f	595c8f88-8be5-46ff-a181-e61b5500cd49	e93753e5-a5a1-4e4b-b449-2490541fa590	\N	\N	\N
9ef328fb-7309-4e15-be85-c2df1b901482	2024-05-25 15:37:35.737	2024-05-25 15:37:35.737	\N	\N	\N	John	Doe	\N	\N	\N	f	595c8f88-8be5-46ff-a181-e61b5500cd49	149aec6a-1693-41a5-b8d0-a40994899a10	\N	\N	\N
42bfb3b4-6b9a-439f-90d4-20787008b63d	2024-05-25 15:37:25.942	2024-05-25 15:37:37.066	user_2gxuFKCgB0kkwajiTpGKsRHPp1X	mlp.dev93@gmail.com	\N	\N	\N	\N	\N	\N	f	595c8f88-8be5-46ff-a181-e61b5500cd49	\N	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yZ3h1RkhEd3NjU05LV2psMkxobnJGTGw4cVAifQ	\N	\N
13daa12f-baf8-44a0-a345-30edaa62e815	2024-06-26 23:18:25.605	2024-06-26 23:22:05.26	\N	tony@hometeam.io	\N	Tony	Jacobs	CTO	\N	\N	t	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	61f03585-a4d4-428e-969f-4a82723ed997	https://kbsc0vz82ntz1jwx.public.blob.vercel-storage.com/profileImages/Frame%203-gkSmpy9aivUf4Xi2Hf4CuHTqclUiz0.png	https://kbsc0vz82ntz1jwx.public.blob.vercel-storage.com/resumes/Resume_Morgan_Pierson%20(3)-hnSH2ENZKBTmVwi64xDnYyJTyGC86w.pdf?download=1	\N
f89392d4-35e4-450f-b0ed-9fd58c0e0e6d	2024-07-07 18:58:53.077	2024-07-07 18:58:53.077	\N	\N	\N	Jeff	Smith	CTO	\N	\N	f	595c8f88-8be5-46ff-a181-e61b5500cd49	d01f8e69-1f8d-44c8-a3c5-a6b5befcff4a	https://kbsc0vz82ntz1jwx.public.blob.vercel-storage.com/profileImages/avatar_1-IsOL5GnWMlQasbs5jaLt5ljOnziZhv.svg	https://kbsc0vz82ntz1jwx.public.blob.vercel-storage.com/resumes/Resume202406211142-IPiFusBKaOYYKCj4LLGtssRQrXFko8.pdf?download=1	\N
f22a6ce4-6c8e-414d-8822-0bdb7daf70ae	2024-07-07 19:04:30.493	2024-07-07 19:12:13.081	\N	\N	\N	Daniel	Cobb	Associate Growth Marketer	\N	\N	t	595c8f88-8be5-46ff-a181-e61b5500cd49	e93753e5-a5a1-4e4b-b449-2490541fa590	https://kbsc0vz82ntz1jwx.public.blob.vercel-storage.com/profileImages/Rectangle-UyrIM0cZDySen4Mp5QRpRoRKo5rjlZ.png	https://kbsc0vz82ntz1jwx.public.blob.vercel-storage.com/resumes/Resume202406211142-xC3pOJI1zlZgP2kh0DP7L1gAUNoVmI.pdf?download=1	\N
\.

-- AcquisitionOffer data
COPY public."AcquisitionOffer" (id, "createdAt", "updatedAt", "userId", amount, "offeringCompanyId", "offerType") FROM stdin;
51fb4e34-6a39-4366-a559-c82235823d55	2024-06-26 23:20:42.563	2024-06-26 23:20:42.563	13daa12f-baf8-44a0-a345-30edaa62e815	8000	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	offering
08c1a0e0-33de-47a3-8d65-37818d471191	2024-07-07 19:11:55.42	2024-07-07 19:11:55.42	f22a6ce4-6c8e-414d-8822-0bdb7daf70ae	8000	595c8f88-8be5-46ff-a181-e61b5500cd49	offering
\.

-- MessageThread data
COPY public."MessageThread" (id, "offerId") FROM stdin;
b3743f06-bcc3-47d7-8dde-e140bfd7384c	51fb4e34-6a39-4366-a559-c82235823d55
c937dd5c-fcba-442e-8668-ac034ab05c8c	08c1a0e0-33de-47a3-8d65-37818d471191
\.

-- OfferMessage data
COPY public."OfferMessage" (id, "createdAt", "updatedAt", "sendingCompanyId", "receivingCompanyId", message, "threadId") FROM stdin;
6700159c-b008-44a9-8a04-1d109e2a0ef0	2024-07-07 19:14:18.569	2024-07-07 19:14:18.569	595c8f88-8be5-46ff-a181-e61b5500cd49	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	We are very interested in learning more about Tony!	b3743f06-bcc3-47d7-8dde-e140bfd7384c
869f9886-0cc3-4c43-86d7-30275f4eb074	2024-07-25 18:17:51.457	2024-07-25 18:17:51.457	e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	595c8f88-8be5-46ff-a181-e61b5500cd49	Hellooooo	c937dd5c-fcba-442e-8668-ac034ab05c8c
\.

-- _CompanyCandidates join table
COPY public."_CompanyCandidates" ("A", "B") FROM stdin;
595c8f88-8be5-46ff-a181-e61b5500cd49	13daa12f-baf8-44a0-a345-30edaa62e815
e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	f22a6ce4-6c8e-414d-8822-0bdb7daf70ae
\.

-- _MessageThreadCompanies join table
COPY public."_MessageThreadCompanies" ("A", "B") FROM stdin;
e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	b3743f06-bcc3-47d7-8dde-e140bfd7384c
595c8f88-8be5-46ff-a181-e61b5500cd49	b3743f06-bcc3-47d7-8dde-e140bfd7384c
e1f1eec8-b4bc-47ab-a0b3-878a91c48aa1	c937dd5c-fcba-442e-8668-ac034ab05c8c
595c8f88-8be5-46ff-a181-e61b5500cd49	c937dd5c-fcba-442e-8668-ac034ab05c8c
\.

-- Re-enable foreign key checks
SET session_replication_role = 'origin';
