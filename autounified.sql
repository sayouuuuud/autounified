--
-- PostgreSQL database dump
--

\restrict KXJkJ162H6ER83dUpVShf4bSELAxpKAlaZWwyFlmdZ7iDjQg3wy6O9TC9i7ARJQ

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_sessions (
    token text NOT NULL,
    email text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL
);


--
-- Name: page_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.page_visits (
    id bigint NOT NULL,
    path text DEFAULT '/'::text NOT NULL,
    referrer text,
    user_agent text,
    country text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: page_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.page_visits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: page_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.page_visits_id_seq OWNED BY public.page_visits.id;


--
-- Name: site_content; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.site_content (
    key text NOT NULL,
    value text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: page_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_visits ALTER COLUMN id SET DEFAULT nextval('public.page_visits_id_seq'::regclass);


--
-- Data for Name: admin_sessions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_sessions (token, email, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: page_visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.page_visits (id, path, referrer, user_agent, country, created_at) FROM stdin;
1	/	https://v0.app/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-18 04:20:37.045213+00
2	/	https://v0.app/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-18 04:29:57.660018+00
3	/	https://v0.app/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-18 04:31:47.246758+00
8	/	https://v0.app/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-18 04:32:41.543215+00
9	/	https://v0.app/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-18 04:35:29.605963+00
10	/	https://v0.app/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-18 04:37:52.565301+00
11	/	https://v0.app/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-18 04:38:39.645451+00
12	/	https://v0.app/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-18 04:40:14.1781+00
13	/	https://v0.app/	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-18 04:56:15.690284+00
\.


--
-- Data for Name: site_content; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.site_content (key, value, updated_at) FROM stdin;
site.domain	autounified.com	2026-04-18 04:15:02.863487+00
site.price_label	$1,000	2026-04-18 04:15:02.863487+00
site.sales_email	sales@autounified.com	2026-04-18 04:15:02.863487+00
site.question_url	mailto:sales@autounified.com?subject=Question%20%E2%80%94%20autounified.com	2026-04-18 04:15:02.863487+00
meta.title	autounified.com — Premium AI Domain / $1,000 USD	2026-04-18 04:15:02.863487+00
meta.description	autounified.com — a one-word .com for the age of autonomous, unified AI. One lot. $1,000 USD.	2026-04-18 04:15:02.863487+00
meta.og_title	autounified.com — Premium AI Domain	2026-04-18 04:15:02.863487+00
meta.og_description	A one-word .com for the age of autonomous, unified AI. $1,000 USD.	2026-04-18 04:15:02.863487+00
nav.lot_label	LOT / 001	2026-04-18 04:15:02.863487+00
nav.domain_label	autounified.com	2026-04-18 04:15:02.863487+00
nav.available_label	Available	2026-04-18 04:15:02.863487+00
nav.cta	Buy → $1,000	2026-04-18 04:15:02.863487+00
nav.link_thesis	Thesis	2026-04-18 04:15:02.863487+00
nav.link_manifesto	Manifesto	2026-04-18 04:15:02.863487+00
nav.link_buyers	Buyers	2026-04-18 04:15:02.863487+00
nav.link_specs	Specs	2026-04-18 04:15:02.863487+00
nav.link_system	System	2026-04-18 04:15:02.863487+00
hero.meta_1_label	001	2026-04-18 04:15:02.863487+00
hero.meta_1_value	Premium .com	2026-04-18 04:15:02.863487+00
hero.meta_2_label	TLD	2026-04-18 04:15:02.863487+00
hero.meta_2_value	.com · gTLD	2026-04-18 04:15:02.863487+00
hero.meta_3_label	LEN	2026-04-18 04:15:02.863487+00
hero.meta_3_value	12 chars · 0 hyphens	2026-04-18 04:15:02.863487+00
hero.meta_4_label	LOT	2026-04-18 04:15:02.863487+00
hero.meta_4_value	Edition I of I	2026-04-18 04:15:02.863487+00
hero.eyebrow	Premium domain — for sale	2026-04-18 04:15:02.863487+00
hero.live_label	Live	2026-04-18 04:15:02.863487+00
hero.headline_part_1	auto	2026-04-18 04:15:02.863487+00
hero.headline_part_2	unified	2026-04-18 04:15:02.863487+00
hero.headline_part_3	.com	2026-04-18 04:15:02.863487+00
hero.sub	A one-word .com for the era when every agent, model & workflow becomes one automated system.	2026-04-18 04:15:02.863487+00
hero.cta_primary	Acquire for $1,000	2026-04-18 04:15:02.863487+00
hero.cta_secondary	See the Thesis	2026-04-18 04:15:02.863487+00
hero.price_label	Price · one-time	2026-04-18 04:15:02.863487+00
hero.price_tag	/LOT·001	2026-04-18 04:15:02.863487+00
hero.price_note	No broker fee. Buyer covers escrow (~1.5%).	2026-04-18 04:15:02.863487+00
hero.whois_status	Listed — ready to transfer	2026-04-18 04:15:02.863487+00
marquee.items	AUTOMATE,UNIFY,ORCHESTRATE,FEDERATE,COMPOSE,AGENT-NATIVE,MULTI-MODEL,INTEROPERABLE,SELF-DIRECTING,SOVEREIGN	2026-04-18 04:15:02.863487+00
flow.section_label	§ 01 / The Thesis	2026-04-18 04:15:02.863487+00
flow.section_hint	fragmented → unified	2026-04-18 04:15:02.863487+00
flow.eyebrow	Automation, unified	2026-04-18 04:15:02.863487+00
flow.headline	Six broken stacks — one name that owns the category.	2026-04-18 04:15:02.863487+00
flow.body	Every AI team today is stitching agents, models and tools with duct tape. The next decade belongs to the platform that makes them feel like one system — automatic and unified. This URL says that out loud.	2026-04-18 04:15:02.863487+00
flow.point_1	One URL. One spelling. One story.	2026-04-18 04:15:02.863487+00
flow.point_2	No hyphens, numbers, or plurals.	2026-04-18 04:15:02.863487+00
flow.point_3	Literal meaning = your product promise.	2026-04-18 04:15:02.863487+00
thesis.section_label	§ 02 / Manifesto	2026-04-18 04:15:02.863487+00
thesis.section_hint	why this name, why now	2026-04-18 04:15:02.863487+00
thesis.auto_eyebrow	/prefix — auto	2026-04-18 04:15:02.863487+00
thesis.auto_title	auto	2026-04-18 04:15:02.863487+00
thesis.auto_body	Greek autós — self. In 2026 it no longer means cars. It means systems that act without waiting to be told. Agents. Decisions at the speed of inference.	2026-04-18 04:15:02.863487+00
thesis.unified_eyebrow	/suffix — unified	2026-04-18 04:15:02.863487+00
thesis.unified_title	unified	2026-04-18 04:15:02.863487+00
thesis.unified_body	The layer that makes every model, tool & agent feel like one thing. Orchestration. Interoperability. A single surface for the many.	2026-04-18 04:15:02.863487+00
thesis.point_1_title	Every AI stack is a mess.	2026-04-18 04:15:02.863487+00
thesis.point_1_body	Dozens of models. Thousands of tools. Pipelines that break on Tuesdays. The winning product of the decade will make it feel like one thing.	2026-04-18 04:15:02.863487+00
thesis.point_2_title	Autonomy without unity is chaos.	2026-04-18 04:15:02.863487+00
thesis.point_2_body	Agents that act on their own are only valuable when they speak the same language, share memory and answer to a single system of record.	2026-04-18 04:15:02.863487+00
thesis.point_3_title	The URL is the flag.	2026-04-18 04:15:02.863487+00
thesis.point_3_body	You can engineer category leadership, but you can only buy the name for it once. autounified.com is the flag — said out loud, it sells itself.	2026-04-18 04:15:02.863487+00
audience.section_label	§ 03 / Intended Buyer	2026-04-18 04:15:02.863487+00
audience.section_hint	six plausible owners	2026-04-18 04:15:02.863487+00
audience.headline	Built for the team that wants the category-defining URL before anyone else thinks to ask.	2026-04-18 04:15:02.863487+00
audience.buyer_a_title	AI Orchestration Platform	2026-04-18 04:15:02.863487+00
audience.buyer_a_body	A control plane for agents, tools and models across every vendor. The name is the pitch.	2026-04-18 04:15:02.863487+00
audience.buyer_b_title	Agentic Infrastructure Startup	2026-04-18 04:15:02.863487+00
audience.buyer_b_body	One brand, one URL — pre-seed deck to Series C announcement. Zero re-branding tax.	2026-04-18 04:15:02.863487+00
audience.buyer_c_title	Multi-Model Gateway	2026-04-18 04:15:02.863487+00
audience.buyer_c_body	Unify OpenAI, Anthropic, xAI, open-source behind one contract. Your users never switch.	2026-04-18 04:15:02.863487+00
audience.buyer_d_title	Enterprise AI Consultancy	2026-04-18 04:15:02.863487+00
audience.buyer_d_body	Position above the implementation crowd. A name clients quote in the boardroom.	2026-04-18 04:15:02.863487+00
audience.buyer_e_title	Autonomous Robotics OS	2026-04-18 04:15:02.863487+00
audience.buyer_e_body	Literal reading: auto + unified. A fleet operating as a single mind.	2026-04-18 04:15:02.863487+00
audience.buyer_f_title	Portfolio / Holding	2026-04-18 04:15:02.863487+00
audience.buyer_f_body	Park it. Own the category phrase before competitors define it. Resale upside obvious.	2026-04-18 04:15:02.863487+00
specs.section_label	§ 04 / Specification	2026-04-18 04:15:02.863487+00
specs.section_hint	record sheet	2026-04-18 04:15:02.863487+00
specs.cert_label	Certificate / AU-001	2026-04-18 04:15:02.863487+00
specs.edition_label	Ed. I of I	2026-04-18 04:15:02.863487+00
specs.issued	04.2026	2026-04-18 04:15:02.863487+00
specs.lot	AU-001	2026-04-18 04:15:02.863487+00
specs.status	AVAILABLE	2026-04-18 04:15:02.863487+00
specs.row_1_label	Domain	2026-04-18 04:15:02.863487+00
specs.row_1_value	autounified.com	2026-04-18 04:15:02.863487+00
specs.row_2_label	Top-level domain	2026-04-18 04:15:02.863487+00
specs.row_2_value	.com	2026-04-18 04:15:02.863487+00
specs.row_3_label	Characters	2026-04-18 04:15:02.863487+00
specs.row_3_value	12	2026-04-18 04:15:02.863487+00
specs.row_4_label	Syllables	2026-04-18 04:15:02.863487+00
specs.row_4_value	5 — au·to·u·ni·fied	2026-04-18 04:15:02.863487+00
specs.row_5_label	Hyphens	2026-04-18 04:15:02.863487+00
specs.row_5_value	0	2026-04-18 04:15:02.863487+00
specs.row_6_label	Numerals	2026-04-18 04:15:02.863487+00
specs.row_6_value	0	2026-04-18 04:15:02.863487+00
specs.row_7_label	Pronunciation	2026-04-18 04:15:02.863487+00
specs.row_7_value	/ˈɔːtoʊ juːnɪfaɪd/	2026-04-18 04:15:02.863487+00
specs.row_8_label	Semantic field	2026-04-18 04:15:02.863487+00
specs.row_8_value	AI · Agents · Orchestration	2026-04-18 04:15:02.863487+00
specs.row_9_label	Trademark conflict	2026-04-18 04:15:02.863487+00
specs.row_9_value	None on USPTO (verify at close)	2026-04-18 04:15:02.863487+00
specs.row_10_label	Transfer	2026-04-18 04:15:02.863487+00
specs.row_10_value	Escrow.com or registrar push	2026-04-18 04:15:02.863487+00
specs.row_11_label	Included	2026-04-18 04:15:02.863487+00
specs.row_11_value	Full registrant transfer + auth code	2026-04-18 04:15:02.863487+00
price.section_label	§ 05 / Acquisition	2026-04-18 04:15:02.863487+00
price.section_hint	one buyer · one wire · done	2026-04-18 04:15:02.863487+00
price.eyebrow	Buy it now	2026-04-18 04:15:02.863487+00
price.headline	A one-time acquisition. No renewals. No royalties. No catch.	2026-04-18 04:15:02.863487+00
price.body	Transfer via Escrow.com (1.5% fee, paid by buyer) or direct push at your registrar — GoDaddy, Namecheap, Cloudflare, Dynadot. Funds clear, auth code sent. Usually same-day.	2026-04-18 04:15:02.863487+00
price.step_1	You reach out. We confirm availability within the hour.	2026-04-18 04:15:02.863487+00
price.step_2	Escrow opened. You wire USD 1,000.	2026-04-18 04:15:02.863487+00
price.step_3	We push the domain. You control it before end of day.	2026-04-18 04:15:02.863487+00
price.card_header	autounified.com — all-in	2026-04-18 04:15:02.863487+00
price.feature_1	Ownership — 100% transferred	2026-04-18 04:15:02.863487+00
price.feature_2	Escrow.com — buyer & seller protected	2026-04-18 04:15:02.863487+00
price.feature_3	Transfer — usually same-day	2026-04-18 04:15:02.863487+00
price.feature_4	Support — free DNS migration help	2026-04-18 04:15:02.863487+00
price.cta_primary	Buy autounified.com	2026-04-18 04:15:02.863487+00
price.cta_secondary	Ask a question	2026-04-18 04:15:02.863487+00
price.footer_note	Secure · Escrow · Same-day	2026-04-18 04:15:02.863487+00
system.eyebrow	Final · The System, live	2026-04-18 04:15:02.863487+00
system.headline_1	Watch it	2026-04-18 04:15:02.863487+00
system.headline_2	unify	2026-04-18 04:15:02.863487+00
system.subline	A live view of the plane.	2026-04-18 04:15:02.863487+00
system.body	One domain. One control plane. Every signal in — one coordinated output out. This is what the name literally does.	2026-04-18 04:15:02.863487+00
system.stat_1	Events / sec	2026-04-18 04:15:02.863487+00
system.stat_2	Agents online	2026-04-18 04:15:02.863487+00
system.stat_3	Uptime · 30d	2026-04-18 04:15:02.863487+00
system.stat_4	Processed · total	2026-04-18 04:15:02.863487+00
footer.manifesto	Good names are bought by the people who move first. If you're still on this page, you're not first — but you could be second.	2026-04-18 04:15:02.863487+00
footer.contact_label	Contact	2026-04-18 04:15:02.863487+00
footer.process_label	Process	2026-04-18 04:15:02.863487+00
footer.process_1	Escrow.com	2026-04-18 04:15:02.863487+00
footer.process_2	Wire · Wise · ACH	2026-04-18 04:15:02.863487+00
footer.process_3	Same-day transfer	2026-04-18 04:15:02.863487+00
footer.sections_label	Sections	2026-04-18 04:15:02.863487+00
footer.copyright	© 2026 — Private listing. Not affiliated with any trademark holder.	2026-04-18 04:15:02.863487+00
footer.lot	Lot 001 / Ed. I of I	2026-04-18 04:15:02.863487+00
site.price_usd	1000	2026-04-18 04:32:38.367682+00
site.buy_url	mailto:sales@autounified.com?subject=Acquisition%20%E2%80%94%20autounified.com&body=Hi%2C%20I%27d%20like%20to%20acquire%20autounified.com%20for%20USD%201%2C000.%20My%20preferred%20registrar%20is%3A%20	2026-04-18 04:32:38.367682+00
system.last_keepalive	2026-04-18 04:32:38.367682+00	2026-04-18 04:32:38.367682+00
footer.link_acquire	Acquire	2026-04-18 04:35:25.868484+00
footer.transmission_label	end · transmission	2026-04-18 04:35:25.868484+00
_system.keepalive	2026-04-18 04:40:10.627318+00	2026-04-18 04:40:10.627318+00
\.


--
-- Name: page_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.page_visits_id_seq', 13, true);


--
-- Name: admin_sessions admin_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_sessions
    ADD CONSTRAINT admin_sessions_pkey PRIMARY KEY (token);


--
-- Name: page_visits page_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.page_visits
    ADD CONSTRAINT page_visits_pkey PRIMARY KEY (id);


--
-- Name: site_content site_content_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.site_content
    ADD CONSTRAINT site_content_pkey PRIMARY KEY (key);


--
-- Name: admin_sessions_expires_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX admin_sessions_expires_idx ON public.admin_sessions USING btree (expires_at);


--
-- Name: page_visits_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX page_visits_created_at_idx ON public.page_visits USING btree (created_at DESC);


--
-- Name: page_visits_path_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX page_visits_path_idx ON public.page_visits USING btree (path);


--
-- Name: admin_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: page_visits; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

--
-- Name: site_content; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

--
-- Name: site_content site_content public read; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "site_content public read" ON public.site_content FOR SELECT TO authenticated, anon USING (true);


--
-- PostgreSQL database dump complete
--

\unrestrict KXJkJ162H6ER83dUpVShf4bSELAxpKAlaZWwyFlmdZ7iDjQg3wy6O9TC9i7ARJQ

