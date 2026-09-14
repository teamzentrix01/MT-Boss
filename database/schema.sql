--
-- PostgreSQL database dump
--

\restrict 5WgJ1C7DGfDhUB26udtEZ5LdM3ue7BQWb3WphtfMAjjaz4wX0G9RQ8mFAqh67sw

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

-- Started on 2026-07-15 15:03:20

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
-- TOC entry 2 (class 3079 OID 43903)
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- TOC entry 5747 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- TOC entry 350 (class 1255 OID 43941)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 43942)
-- Name: aadhaar_otp_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.aadhaar_otp_log (
    id integer NOT NULL,
    supplier_id integer NOT NULL,
    aadhaar_number character varying(12) NOT NULL,
    status character varying(20) DEFAULT 'sent'::character varying NOT NULL,
    sent_at timestamp with time zone DEFAULT now() NOT NULL,
    verified_at timestamp with time zone,
    CONSTRAINT aadhaar_otp_log_status_check CHECK (((status)::text = ANY (ARRAY[('sent'::character varying)::text, ('verified'::character varying)::text, ('failed'::character varying)::text, ('expired'::character varying)::text])))
);


ALTER TABLE public.aadhaar_otp_log OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 43953)
-- Name: aadhaar_otp_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.aadhaar_otp_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.aadhaar_otp_log_id_seq OWNER TO postgres;

--
-- TOC entry 5748 (class 0 OID 0)
-- Dependencies: 221
-- Name: aadhaar_otp_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.aadhaar_otp_log_id_seq OWNED BY public.aadhaar_otp_log.id;


--
-- TOC entry 222 (class 1259 OID 43954)
-- Name: admin_activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_activity_logs (
    id integer NOT NULL,
    admin_id integer,
    action character varying(100) NOT NULL,
    entity_type character varying(50),
    entity_id integer,
    details jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.admin_activity_logs OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 43962)
-- Name: admin_activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_activity_logs_id_seq OWNER TO postgres;

--
-- TOC entry 5749 (class 0 OID 0)
-- Dependencies: 223
-- Name: admin_activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_activity_logs_id_seq OWNED BY public.admin_activity_logs.id;


--
-- TOC entry 298 (class 1259 OID 45295)
-- Name: agent_leads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_leads (
    id integer NOT NULL,
    agent_id integer,
    city character varying(100) NOT NULL,
    client_name character varying(150) NOT NULL,
    client_phone character varying(30) NOT NULL,
    client_email character varying(255),
    service_type character varying(120),
    lead_type character varying(120),
    status character varying(30) DEFAULT 'New'::character varying,
    follow_up_date date,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    lead_stage character varying(50) DEFAULT 'New'::character varying,
    meeting_done boolean DEFAULT false,
    estimate_sent boolean DEFAULT false,
    final_amount numeric DEFAULT 0,
    daily_visit_notes text,
    client_requirement text,
    lead_source character varying(120) DEFAULT 'offline'::character varying,
    assigned_franchise_id integer,
    assigned_by_role character varying(40) DEFAULT 'admin'::character varying,
    source_ref_table character varying(80),
    source_ref_id integer,
    priority character varying(30) DEFAULT 'Normal'::character varying
);


ALTER TABLE public.agent_leads OWNER TO postgres;

--
-- TOC entry 297 (class 1259 OID 45294)
-- Name: agent_leads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agent_leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agent_leads_id_seq OWNER TO postgres;

--
-- TOC entry 5750 (class 0 OID 0)
-- Dependencies: 297
-- Name: agent_leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agent_leads_id_seq OWNED BY public.agent_leads.id;


--
-- TOC entry 300 (class 1259 OID 45317)
-- Name: agent_schedule; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agent_schedule (
    id integer NOT NULL,
    agent_id integer NOT NULL,
    city character varying(100) NOT NULL,
    title character varying(180) NOT NULL,
    schedule_date date NOT NULL,
    schedule_time character varying(30),
    type character varying(80),
    status character varying(30) DEFAULT 'Planned'::character varying,
    notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.agent_schedule OWNER TO postgres;

--
-- TOC entry 299 (class 1259 OID 45316)
-- Name: agent_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agent_schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agent_schedule_id_seq OWNER TO postgres;

--
-- TOC entry 5751 (class 0 OID 0)
-- Dependencies: 299
-- Name: agent_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agent_schedule_id_seq OWNED BY public.agent_schedule.id;


--
-- TOC entry 224 (class 1259 OID 43963)
-- Name: agents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agents (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    city character varying(100),
    state character varying(100),
    occupation character varying(255),
    agent_type character varying(100),
    experience character varying(100),
    network character varying(100),
    message text,
    status character varying(50) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    login_enabled boolean DEFAULT false,
    password_hash text,
    must_change_password boolean DEFAULT false,
    approved_at timestamp without time zone,
    approved_by character varying(255),
    last_login_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.agents OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 43974)
-- Name: agents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.agents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.agents_id_seq OWNER TO postgres;

--
-- TOC entry 5752 (class 0 OID 0)
-- Dependencies: 225
-- Name: agents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.agents_id_seq OWNED BY public.agents.id;


--
-- TOC entry 226 (class 1259 OID 43975)
-- Name: booking_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_messages (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    sender_type character varying(20),
    sender_id integer,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.booking_messages OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 43984)
-- Name: booking_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_messages_id_seq OWNER TO postgres;

--
-- TOC entry 5753 (class 0 OID 0)
-- Dependencies: 227
-- Name: booking_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_messages_id_seq OWNED BY public.booking_messages.id;


--
-- TOC entry 228 (class 1259 OID 43985)
-- Name: booking_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.booking_ratings (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    vendor_id integer,
    user_id integer,
    rating_stars integer NOT NULL,
    review_text text,
    cleanliness_rating integer,
    professionalism_rating integer,
    punctuality_rating integer,
    would_recommend boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT booking_ratings_rating_stars_check CHECK (((rating_stars >= 1) AND (rating_stars <= 5)))
);


ALTER TABLE public.booking_ratings OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 43996)
-- Name: booking_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.booking_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.booking_ratings_id_seq OWNER TO postgres;

--
-- TOC entry 5754 (class 0 OID 0)
-- Dependencies: 229
-- Name: booking_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.booking_ratings_id_seq OWNED BY public.booking_ratings.id;


--
-- TOC entry 230 (class 1259 OID 43997)
-- Name: calculator_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calculator_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    badge character varying(50) DEFAULT 'Recommended'::character varying,
    image_url text DEFAULT ''::text,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.calculator_categories OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 44010)
-- Name: calculator_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calculator_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calculator_categories_id_seq OWNER TO postgres;

--
-- TOC entry 5755 (class 0 OID 0)
-- Dependencies: 231
-- Name: calculator_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calculator_categories_id_seq OWNED BY public.calculator_categories.id;


--
-- TOC entry 232 (class 1259 OID 44011)
-- Name: calculator_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calculator_products (
    id integer NOT NULL,
    category character varying(100) NOT NULL,
    badge character varying(50) DEFAULT 'Recommended'::character varying,
    name character varying(200) NOT NULL,
    description text DEFAULT ''::text,
    image_url text DEFAULT ''::text,
    unit character varying(50) DEFAULT 'unit'::character varying,
    price numeric(12,2) DEFAULT 0 NOT NULL,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    city_prices jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.calculator_products OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 44030)
-- Name: calculator_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calculator_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calculator_products_id_seq OWNER TO postgres;

--
-- TOC entry 5756 (class 0 OID 0)
-- Dependencies: 233
-- Name: calculator_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calculator_products_id_seq OWNED BY public.calculator_products.id;


--
-- TOC entry 312 (class 1259 OID 48638)
-- Name: calculator_quote_otps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calculator_quote_otps (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30) NOT NULL,
    address text NOT NULL,
    estimate jsonb,
    otp_hash text,
    attempts integer DEFAULT 0,
    verified boolean DEFAULT false,
    used boolean DEFAULT false,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    verified_at timestamp with time zone,
    site_image_url text,
    site_image_name text
);


ALTER TABLE public.calculator_quote_otps OWNER TO postgres;

--
-- TOC entry 311 (class 1259 OID 48637)
-- Name: calculator_quote_otps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calculator_quote_otps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.calculator_quote_otps_id_seq OWNER TO postgres;

--
-- TOC entry 5757 (class 0 OID 0)
-- Dependencies: 311
-- Name: calculator_quote_otps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.calculator_quote_otps_id_seq OWNED BY public.calculator_quote_otps.id;


--
-- TOC entry 234 (class 1259 OID 44031)
-- Name: calculator_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calculator_settings (
    id integer DEFAULT 1 NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT calculator_settings_single_row CHECK ((id = 1))
);


ALTER TABLE public.calculator_settings OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 44043)
-- Name: career_enquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.career_enquiries (
    id integer NOT NULL,
    job_id character varying(100),
    "position" character varying(255) NOT NULL,
    department character varying(255),
    job_location character varying(255),
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    experience character varying(100) NOT NULL,
    current_company character varying(255),
    notice_period character varying(100),
    current_salary character varying(100),
    expected_salary character varying(100),
    resume_name character varying(255),
    cover_letter text,
    status character varying(50) DEFAULT 'New'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    resume_url text
);


ALTER TABLE public.career_enquiries OWNER TO postgres;

--
-- TOC entry 236 (class 1259 OID 44056)
-- Name: career_enquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.career_enquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.career_enquiries_id_seq OWNER TO postgres;

--
-- TOC entry 5758 (class 0 OID 0)
-- Dependencies: 236
-- Name: career_enquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.career_enquiries_id_seq OWNED BY public.career_enquiries.id;


--
-- TOC entry 237 (class 1259 OID 44057)
-- Name: contact_submissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_submissions (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    department character varying(100) NOT NULL,
    subject character varying(500) NOT NULL,
    message text NOT NULL,
    status character varying(50) DEFAULT 'New'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contact_submissions OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 44072)
-- Name: contact_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_submissions_id_seq OWNER TO postgres;

--
-- TOC entry 5759 (class 0 OID 0)
-- Dependencies: 238
-- Name: contact_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_submissions_id_seq OWNED BY public.contact_submissions.id;


--
-- TOC entry 239 (class 1259 OID 44073)
-- Name: franchises; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.franchises (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    father_name character varying(255),
    dob character varying(50),
    gender character varying(20),
    marital_status character varying(30),
    phone character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    occupation character varying(255),
    qualification character varying(100),
    annual_income character varying(100),
    id_type character varying(50),
    id_number character varying(100),
    pan character varying(20),
    address text,
    district character varying(100),
    city character varying(100),
    state character varying(100),
    pin_code character varying(10),
    current_business character varying(255),
    experience character varying(50),
    construction_exp character varying(100),
    employees character varying(50),
    network text,
    bank_name character varying(255),
    branch_name character varying(255),
    account_number character varying(100),
    ifsc_code character varying(20),
    model character varying(100),
    investment character varying(100),
    territory character varying(255),
    referral_source character varying(100),
    start_date character varying(50),
    service_category character varying(100),
    office_area character varying(255),
    office_district character varying(100),
    premises_ownership character varying(100),
    lease_duration character varying(50),
    office_area_sqft character varying(50),
    office_type character varying(100),
    message text,
    other_franchise character varying(100),
    training_willing character varying(100),
    status character varying(50) DEFAULT 'Pending'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.franchises OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 44084)
-- Name: franchises_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.franchises_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.franchises_id_seq OWNER TO postgres;

--
-- TOC entry 5760 (class 0 OID 0)
-- Dependencies: 240
-- Name: franchises_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.franchises_id_seq OWNED BY public.franchises.id;


--
-- TOC entry 241 (class 1259 OID 44085)
-- Name: free_time_slots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.free_time_slots (
    id integer NOT NULL,
    quick_service_id integer NOT NULL,
    slot_start time without time zone NOT NULL,
    slot_end time without time zone NOT NULL,
    slot_date date NOT NULL,
    city character varying(100) NOT NULL,
    is_available boolean DEFAULT true,
    max_bookings integer DEFAULT 1,
    current_bookings integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.free_time_slots OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 44098)
-- Name: free_time_slots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.free_time_slots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.free_time_slots_id_seq OWNER TO postgres;

--
-- TOC entry 5761 (class 0 OID 0)
-- Dependencies: 242
-- Name: free_time_slots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.free_time_slots_id_seq OWNED BY public.free_time_slots.id;


--
-- TOC entry 243 (class 1259 OID 44099)
-- Name: hero_banners; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hero_banners (
    id integer NOT NULL,
    label character varying(255) DEFAULT 'Engineering Excellence'::character varying,
    title character varying(500) NOT NULL,
    subtitle character varying(500),
    description text,
    image_url text NOT NULL,
    cloudinary_public_id character varying(255),
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.hero_banners OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 44112)
-- Name: hero_banners_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hero_banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hero_banners_id_seq OWNER TO postgres;

--
-- TOC entry 5762 (class 0 OID 0)
-- Dependencies: 244
-- Name: hero_banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hero_banners_id_seq OWNED BY public.hero_banners.id;


--
-- TOC entry 245 (class 1259 OID 44113)
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    department character varying(120) NOT NULL,
    location character varying(180) NOT NULL,
    type character varying(80) DEFAULT 'Full Time'::character varying NOT NULL,
    experience character varying(120) NOT NULL,
    salary character varying(120),
    description text NOT NULL,
    responsibilities jsonb DEFAULT '[]'::jsonb,
    requirements jsonb DEFAULT '[]'::jsonb,
    skills jsonb DEFAULT '[]'::jsonb,
    urgent boolean DEFAULT false,
    status character varying(30) DEFAULT 'active'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 44133)
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- TOC entry 5763 (class 0 OID 0)
-- Dependencies: 246
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- TOC entry 247 (class 1259 OID 44134)
-- Name: material_enquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.material_enquiries (
    id integer NOT NULL,
    user_name character varying(255) NOT NULL,
    user_phone character varying(20) NOT NULL,
    user_email character varying(255),
    category_name character varying(255) NOT NULL,
    category_emoji text DEFAULT ''::character varying,
    quantity_text character varying(255),
    delivery_address text,
    latitude numeric(10,8),
    longitude numeric(11,8),
    message text,
    status character varying(50) DEFAULT 'open'::character varying,
    accepted_by_supplier_id integer,
    accepted_at timestamp without time zone,
    fulfilled_at timestamp without time zone,
    amount_received numeric(10,2),
    admin_commission numeric(10,2),
    supplier_notes text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    selected_city character varying(100),
    material_type character varying(255),
    subcategory_name character varying(255),
    brand_company character varying(255),
    delivery_date date
);


ALTER TABLE public.material_enquiries OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 44147)
-- Name: material_enquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.material_enquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.material_enquiries_id_seq OWNER TO postgres;

--
-- TOC entry 5764 (class 0 OID 0)
-- Dependencies: 248
-- Name: material_enquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.material_enquiries_id_seq OWNED BY public.material_enquiries.id;


--
-- TOC entry 249 (class 1259 OID 44148)
-- Name: password_reset_otps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_otps (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    user_type character varying(20) NOT NULL,
    otp character varying(6) NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    used boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.password_reset_otps OWNER TO postgres;

--
-- TOC entry 250 (class 1259 OID 44158)
-- Name: password_reset_otps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_reset_otps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_reset_otps_id_seq OWNER TO postgres;

--
-- TOC entry 5765 (class 0 OID 0)
-- Dependencies: 250
-- Name: password_reset_otps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_reset_otps_id_seq OWNED BY public.password_reset_otps.id;


--
-- TOC entry 251 (class 1259 OID 44159)
-- Name: primary_service_enquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.primary_service_enquiries (
    id integer NOT NULL,
    service_slug character varying(255),
    service_title character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    email character varying(255),
    message text,
    status character varying(50) DEFAULT 'Site Visit'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    property_image_name character varying(255),
    property_image_url text,
    property_image_names jsonb,
    property_image_urls jsonb,
    budget character varying(150),
    carpet_area character varying(100),
    time_slot character varying(100),
    meeting_date date,
    gps_location character varying(100),
    address text,
    alternate_phone character varying(50),
    user_id integer,
    rating_stars integer,
    review_text text,
    site_image_names jsonb,
    site_image_urls jsonb,
    reviewed_at timestamp without time zone
);


ALTER TABLE public.primary_service_enquiries OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 44170)
-- Name: primary_service_enquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.primary_service_enquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.primary_service_enquiries_id_seq OWNER TO postgres;

--
-- TOC entry 5766 (class 0 OID 0)
-- Dependencies: 252
-- Name: primary_service_enquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.primary_service_enquiries_id_seq OWNED BY public.primary_service_enquiries.id;


--
-- TOC entry 253 (class 1259 OID 44171)
-- Name: primary_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.primary_services (
    id integer NOT NULL,
    slug character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    image character varying(500) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hero_subtitle text,
    about_heading character varying(255),
    about_body text,
    stat1_value character varying(50),
    stat1_label character varying(100),
    stat2_value character varying(50),
    stat2_label character varying(100),
    stat3_value character varying(50),
    stat3_label character varying(100),
    stat4_value character varying(50),
    stat4_label character varying(100),
    process jsonb DEFAULT '[]'::jsonb,
    benefits jsonb DEFAULT '[]'::jsonb,
    projects jsonb DEFAULT '[]'::jsonb,
    cta_heading character varying(255),
    contact_phone character varying(50),
    contact_email character varying(100)
);


ALTER TABLE public.primary_services OWNER TO postgres;

--
-- TOC entry 254 (class 1259 OID 44186)
-- Name: primary_services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.primary_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.primary_services_id_seq OWNER TO postgres;

--
-- TOC entry 5767 (class 0 OID 0)
-- Dependencies: 254
-- Name: primary_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.primary_services_id_seq OWNED BY public.primary_services.id;


--
-- TOC entry 255 (class 1259 OID 44187)
-- Name: professional_enquiries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professional_enquiries (
    id integer NOT NULL,
    professional_id integer,
    professional_name character varying(200),
    professional_email character varying(200),
    enquirer_name character varying(200) NOT NULL,
    enquirer_email character varying(200) NOT NULL,
    enquirer_phone character varying(20),
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.professional_enquiries OWNER TO postgres;

--
-- TOC entry 256 (class 1259 OID 44198)
-- Name: professional_enquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professional_enquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professional_enquiries_id_seq OWNER TO postgres;

--
-- TOC entry 5768 (class 0 OID 0)
-- Dependencies: 256
-- Name: professional_enquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professional_enquiries_id_seq OWNED BY public.professional_enquiries.id;


--
-- TOC entry 257 (class 1259 OID 44199)
-- Name: professional_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.professional_services (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    title character varying(200) NOT NULL,
    category character varying(100) NOT NULL,
    profile_picture text,
    experience integer DEFAULT 0,
    description text,
    specializations jsonb DEFAULT '[]'::jsonb,
    portfolio_images jsonb DEFAULT '[]'::jsonb,
    certifications text,
    city character varying(100),
    phone character varying(20),
    email character varying(200) NOT NULL,
    website character varying(300),
    instagram character varying(200),
    linkedin character varying(200),
    status character varying(20) DEFAULT 'pending'::character varying,
    sort_order integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    CONSTRAINT professional_services_status_check CHECK (((status)::text = ANY (ARRAY[('pending'::character varying)::text, ('approved'::character varying)::text, ('rejected'::character varying)::text])))
);


ALTER TABLE public.professional_services OWNER TO postgres;

--
-- TOC entry 258 (class 1259 OID 44217)
-- Name: professional_services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.professional_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.professional_services_id_seq OWNER TO postgres;

--
-- TOC entry 5769 (class 0 OID 0)
-- Dependencies: 258
-- Name: professional_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.professional_services_id_seq OWNED BY public.professional_services.id;


--
-- TOC entry 308 (class 1259 OID 45440)
-- Name: project_expenses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_expenses (
    id integer NOT NULL,
    project_id integer NOT NULL,
    agent_id integer,
    expense_type text NOT NULL,
    amount numeric DEFAULT 0 NOT NULL,
    expense_date date DEFAULT CURRENT_DATE NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.project_expenses OWNER TO postgres;

--
-- TOC entry 307 (class 1259 OID 45439)
-- Name: project_expenses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_expenses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_expenses_id_seq OWNER TO postgres;

--
-- TOC entry 5770 (class 0 OID 0)
-- Dependencies: 307
-- Name: project_expenses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_expenses_id_seq OWNED BY public.project_expenses.id;


--
-- TOC entry 304 (class 1259 OID 45383)
-- Name: project_labour_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_labour_entries (
    id integer NOT NULL,
    project_id integer NOT NULL,
    agent_id integer,
    labour_name text NOT NULL,
    labour_role text,
    work_date date DEFAULT CURRENT_DATE NOT NULL,
    attendance_status text DEFAULT 'present'::text,
    wage_amount numeric DEFAULT 0,
    paid_amount numeric DEFAULT 0,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.project_labour_entries OWNER TO postgres;

--
-- TOC entry 303 (class 1259 OID 45382)
-- Name: project_labour_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_labour_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_labour_entries_id_seq OWNER TO postgres;

--
-- TOC entry 5771 (class 0 OID 0)
-- Dependencies: 303
-- Name: project_labour_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_labour_entries_id_seq OWNED BY public.project_labour_entries.id;


--
-- TOC entry 306 (class 1259 OID 45411)
-- Name: project_material_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_material_entries (
    id integer NOT NULL,
    project_id integer NOT NULL,
    agent_id integer,
    material_name text NOT NULL,
    quantity numeric DEFAULT 0 NOT NULL,
    unit text,
    rate numeric DEFAULT 0,
    total_amount numeric DEFAULT 0,
    supplier_name text,
    vehicle_number text,
    bill_url text,
    entry_date date DEFAULT CURRENT_DATE NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.project_material_entries OWNER TO postgres;

--
-- TOC entry 305 (class 1259 OID 45410)
-- Name: project_material_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_material_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_material_entries_id_seq OWNER TO postgres;

--
-- TOC entry 5772 (class 0 OID 0)
-- Dependencies: 305
-- Name: project_material_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_material_entries_id_seq OWNED BY public.project_material_entries.id;


--
-- TOC entry 310 (class 1259 OID 45467)
-- Name: project_media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_media (
    id integer NOT NULL,
    project_id integer NOT NULL,
    agent_id integer,
    media_type text DEFAULT 'photo'::text,
    media_url text NOT NULL,
    caption text,
    media_date date DEFAULT CURRENT_DATE NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.project_media OWNER TO postgres;

--
-- TOC entry 309 (class 1259 OID 45466)
-- Name: project_media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_media_id_seq OWNER TO postgres;

--
-- TOC entry 5773 (class 0 OID 0)
-- Dependencies: 309
-- Name: project_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_media_id_seq OWNED BY public.project_media.id;


--
-- TOC entry 302 (class 1259 OID 45357)
-- Name: project_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.project_payments (
    id integer NOT NULL,
    project_id integer NOT NULL,
    agent_id integer,
    amount numeric DEFAULT 0 NOT NULL,
    payment_date date DEFAULT CURRENT_DATE NOT NULL,
    payment_mode text,
    notes text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.project_payments OWNER TO postgres;

--
-- TOC entry 301 (class 1259 OID 45356)
-- Name: project_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.project_payments_id_seq OWNER TO postgres;

--
-- TOC entry 5774 (class 0 OID 0)
-- Dependencies: 301
-- Name: project_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.project_payments_id_seq OWNED BY public.project_payments.id;


--
-- TOC entry 259 (class 1259 OID 44218)
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    location character varying(255),
    description text,
    image_url text NOT NULL,
    cloudinary_public_id character varying(255),
    size character varying(20) DEFAULT 'small'::character varying,
    status character varying(20) DEFAULT 'published'::character varying,
    created_at timestamp without time zone DEFAULT now(),
    franchise_id integer,
    assigned_agent_id integer,
    created_by_role text DEFAULT 'admin'::text,
    project_notes text,
    client_name text,
    client_phone text,
    client_email text,
    deal_amount numeric DEFAULT 0,
    project_status text DEFAULT 'lead'::text,
    started_at timestamp with time zone,
    completed_at timestamp with time zone
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- TOC entry 260 (class 1259 OID 44230)
-- Name: projects_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.projects_id_seq OWNER TO postgres;

--
-- TOC entry 5775 (class 0 OID 0)
-- Dependencies: 260
-- Name: projects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_id_seq OWNED BY public.projects.id;


--
-- TOC entry 261 (class 1259 OID 44231)
-- Name: properties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    type character varying(50) NOT NULL,
    listing_type character varying(10) NOT NULL,
    category character varying(50),
    price character varying(50) NOT NULL,
    price_raw bigint NOT NULL,
    location character varying(100) NOT NULL,
    address text,
    beds integer,
    baths integer,
    area integer,
    description text,
    highlights jsonb DEFAULT '[]'::jsonb,
    images jsonb DEFAULT '[]'::jsonb,
    tag character varying(30) DEFAULT 'New'::character varying,
    seller_type character varying(20) DEFAULT 'owner'::character varying,
    seller_name character varying(100),
    seller_phone character varying(20),
    seller_email character varying(100),
    status character varying(20) DEFAULT 'pending'::character varying,
    verified_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT properties_listing_type_check CHECK (((listing_type)::text = ANY (ARRAY[('buy'::character varying)::text, ('rent'::character varying)::text])))
);


ALTER TABLE public.properties OWNER TO postgres;

--
-- TOC entry 262 (class 1259 OID 44251)
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.properties_id_seq OWNER TO postgres;

--
-- TOC entry 5776 (class 0 OID 0)
-- Dependencies: 262
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- TOC entry 263 (class 1259 OID 44252)
-- Name: quick_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quick_services (
    id integer NOT NULL,
    icon character varying(10) NOT NULL,
    label character varying(100) NOT NULL,
    description text NOT NULL,
    base_price numeric(10,2) NOT NULL,
    duration character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    admin_base_price numeric(10,2),
    is_service_active boolean DEFAULT true,
    sort_order integer DEFAULT 0,
    slug text,
    video_url text,
    seo_title text,
    seo_description text,
    coverage_details text,
    how_to_use text
);


ALTER TABLE public.quick_services OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 44267)
-- Name: quick_services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quick_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quick_services_id_seq OWNER TO postgres;

--
-- TOC entry 5777 (class 0 OID 0)
-- Dependencies: 264
-- Name: quick_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quick_services_id_seq OWNED BY public.quick_services.id;


--
-- TOC entry 265 (class 1259 OID 44268)
-- Name: service_bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_bookings (
    id integer NOT NULL,
    booking_reference character varying(50) NOT NULL,
    user_id integer,
    quick_service_id integer NOT NULL,
    vendor_id integer,
    user_name character varying(255) NOT NULL,
    user_phone character varying(20) NOT NULL,
    user_email character varying(255),
    service_address text NOT NULL,
    service_city character varying(100) NOT NULL,
    service_pincode character varying(6) NOT NULL,
    property_type character varying(100),
    booking_date date NOT NULL,
    booking_time character varying(50),
    slot_type character varying(20),
    time_slot_id integer,
    user_latitude numeric(10,8),
    user_longitude numeric(11,8),
    location_map_url character varying(500),
    urgency character varying(20) DEFAULT 'normal'::character varying,
    visit_charge numeric(10,2) DEFAULT 0,
    service_description text,
    status character varying(50) DEFAULT 'pending'::character varying,
    vendor_status character varying(50),
    user_status character varying(50),
    base_amount numeric(10,2),
    final_amount numeric(10,2),
    visit_fee numeric(10,2) DEFAULT 0,
    tax_amount numeric(10,2),
    total_amount numeric(10,2),
    payment_status character varying(20) DEFAULT 'pending'::character varying,
    user_paid_amount numeric(10,2),
    vendor_notes text,
    user_notes text,
    admin_notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    assigned_at timestamp without time zone,
    accepted_at timestamp without time zone,
    started_at timestamp without time zone,
    completed_at timestamp without time zone,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_quick_job boolean DEFAULT false,
    extra_amount numeric(10,2) DEFAULT 0,
    start_otp text,
    start_otp_verified boolean DEFAULT false,
    start_otp_generated_at timestamp with time zone,
    start_otp_attempts integer DEFAULT 0,
    service_started_at timestamp with time zone,
    finish_otp text,
    finish_otp_verified boolean DEFAULT false,
    finish_otp_generated_at timestamp with time zone,
    finish_otp_attempts integer DEFAULT 0,
    service_finished_at timestamp with time zone
);


ALTER TABLE public.service_bookings OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 44291)
-- Name: service_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_bookings_id_seq OWNER TO postgres;

--
-- TOC entry 5778 (class 0 OID 0)
-- Dependencies: 266
-- Name: service_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_bookings_id_seq OWNED BY public.service_bookings.id;


--
-- TOC entry 267 (class 1259 OID 44292)
-- Name: service_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.service_notifications (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    vendor_id integer NOT NULL,
    service_id integer,
    notification_status character varying(50) DEFAULT 'pending'::character varying,
    expires_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    notification_type character varying(50) DEFAULT 'NEW_BOOKING'::character varying,
    title character varying(255),
    message text,
    is_read boolean DEFAULT false
);


ALTER TABLE public.service_notifications OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 44305)
-- Name: service_notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.service_notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.service_notifications_id_seq OWNER TO postgres;

--
-- TOC entry 5779 (class 0 OID 0)
-- Dependencies: 268
-- Name: service_notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.service_notifications_id_seq OWNED BY public.service_notifications.id;


--
-- TOC entry 269 (class 1259 OID 44306)
-- Name: shop_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shop_categories (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    image text,
    emoji character varying(20) DEFAULT '🛒'::character varying,
    label character varying(100) DEFAULT ''::character varying,
    label_color character varying(50) DEFAULT 'yellow'::character varying,
    price_range character varying(100) DEFAULT ''::character varying,
    unit character varying(100) DEFAULT ''::character varying,
    sort_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    types jsonb DEFAULT '[]'::jsonb,
    subcategories jsonb DEFAULT '[]'::jsonb,
    city_prices jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.shop_categories OWNER TO postgres;

--
-- TOC entry 270 (class 1259 OID 44325)
-- Name: shop_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shop_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.shop_categories_id_seq OWNER TO postgres;

--
-- TOC entry 5780 (class 0 OID 0)
-- Dependencies: 270
-- Name: shop_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shop_categories_id_seq OWNED BY public.shop_categories.id;


--
-- TOC entry 271 (class 1259 OID 44326)
-- Name: supplier_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_categories (
    id integer NOT NULL,
    supplier_id integer NOT NULL,
    name character varying(255) NOT NULL,
    emoji character varying(10) DEFAULT '🧱'::character varying NOT NULL,
    label character varying(100) NOT NULL,
    label_color character varying(20) DEFAULT 'blue'::character varying NOT NULL,
    price_range character varying(100) NOT NULL,
    unit character varying(100) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT supplier_categories_label_check CHECK (((label)::text = ANY (ARRAY[('HIGH VOLUME'::character varying)::text, ('ALWAYS NEEDED'::character varying)::text, ('GROWING'::character varying)::text, ('STEADY DEMAND'::character varying)::text, ('SPECIALIZED'::character varying)::text, ('REGULAR SUPPLY'::character varying)::text, ('BULK SUPPLY'::character varying)::text, ('HIGH DEMAND'::character varying)::text]))),
    CONSTRAINT supplier_categories_label_color_check CHECK (((label_color)::text = ANY (ARRAY[('blue'::character varying)::text, ('yellow'::character varying)::text, ('green'::character varying)::text, ('purple'::character varying)::text, ('pink'::character varying)::text, ('orange'::character varying)::text, ('amber'::character varying)::text, ('cyan'::character varying)::text])))
);


ALTER TABLE public.supplier_categories OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 44347)
-- Name: supplier_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supplier_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_categories_id_seq OWNER TO postgres;

--
-- TOC entry 5781 (class 0 OID 0)
-- Dependencies: 272
-- Name: supplier_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supplier_categories_id_seq OWNED BY public.supplier_categories.id;


--
-- TOC entry 273 (class 1259 OID 44348)
-- Name: supplier_materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_materials (
    id integer NOT NULL,
    supplier_id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    price numeric(10,2),
    unit character varying(100),
    quantity integer DEFAULT 0,
    image_url text,
    category character varying(255),
    is_available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.supplier_materials OWNER TO postgres;

--
-- TOC entry 274 (class 1259 OID 44360)
-- Name: supplier_materials_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supplier_materials_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_materials_id_seq OWNER TO postgres;

--
-- TOC entry 5782 (class 0 OID 0)
-- Dependencies: 274
-- Name: supplier_materials_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supplier_materials_id_seq OWNED BY public.supplier_materials.id;


--
-- TOC entry 275 (class 1259 OID 44361)
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    shop_name character varying(255) NOT NULL,
    business_name character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    city character varying(100),
    state character varying(100),
    country character varying(100) DEFAULT 'India'::character varying,
    postal_code character varying(20),
    business_type character varying(100),
    description text,
    bank_account_holder character varying(255),
    bank_account_number character varying(50),
    bank_name character varying(255),
    bank_ifsc_code character varying(20),
    aadhaar_number character varying(12),
    aadhaar_status character varying(20) DEFAULT 'unverified'::character varying,
    status character varying(20) DEFAULT 'pending'::character varying,
    rejection_reason text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    approved_at timestamp with time zone,
    last_login_at timestamp with time zone,
    is_active boolean DEFAULT true,
    product_categories text[] DEFAULT '{}'::text[],
    package_id text,
    package_name text,
    package_price numeric DEFAULT 0,
    package_duration_months integer DEFAULT 0,
    package_purchased_at timestamp with time zone,
    package_starts_at timestamp with time zone,
    package_expires_at timestamp with time zone,
    package_status text DEFAULT 'none'::text,
    CONSTRAINT suppliers_aadhaar_status_check CHECK (((aadhaar_status)::text = ANY (ARRAY[('unverified'::character varying)::text, ('pending'::character varying)::text, ('verified'::character varying)::text])))
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- TOC entry 276 (class 1259 OID 44380)
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO postgres;

--
-- TOC entry 5783 (class 0 OID 0)
-- Dependencies: 276
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- TOC entry 277 (class 1259 OID 44381)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    name character varying(255),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 278 (class 1259 OID 44391)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5784 (class 0 OID 0)
-- Dependencies: 278
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 279 (class 1259 OID 44392)
-- Name: vendor_availability; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_availability (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    day_of_week character varying(10) NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    is_available boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vendor_availability OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 44402)
-- Name: vendor_availability_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_availability_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_availability_id_seq OWNER TO postgres;

--
-- TOC entry 5785 (class 0 OID 0)
-- Dependencies: 280
-- Name: vendor_availability_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_availability_id_seq OWNED BY public.vendor_availability.id;


--
-- TOC entry 281 (class 1259 OID 44403)
-- Name: vendor_average_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_average_ratings (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    average_rating numeric(3,2) DEFAULT 0,
    total_ratings integer DEFAULT 0,
    five_star_count integer DEFAULT 0,
    four_star_count integer DEFAULT 0,
    three_star_count integer DEFAULT 0,
    two_star_count integer DEFAULT 0,
    one_star_count integer DEFAULT 0,
    cleanliness_avg numeric(3,2) DEFAULT 0,
    professionalism_avg numeric(3,2) DEFAULT 0,
    punctuality_avg numeric(3,2) DEFAULT 0,
    recommend_percentage integer DEFAULT 0,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.vendor_average_ratings OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 44420)
-- Name: vendor_average_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_average_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_average_ratings_id_seq OWNER TO postgres;

--
-- TOC entry 5786 (class 0 OID 0)
-- Dependencies: 282
-- Name: vendor_average_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_average_ratings_id_seq OWNED BY public.vendor_average_ratings.id;


--
-- TOC entry 283 (class 1259 OID 44421)
-- Name: vendor_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_orders (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    customer_id integer,
    order_number character varying(50) NOT NULL,
    total_amount numeric(15,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vendor_orders OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 44431)
-- Name: vendor_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_orders_id_seq OWNER TO postgres;

--
-- TOC entry 5787 (class 0 OID 0)
-- Dependencies: 284
-- Name: vendor_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_orders_id_seq OWNED BY public.vendor_orders.id;


--
-- TOC entry 285 (class 1259 OID 44432)
-- Name: vendor_payouts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_payouts (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    amount numeric(15,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    payout_date timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vendor_payouts OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 44440)
-- Name: vendor_payouts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_payouts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_payouts_id_seq OWNER TO postgres;

--
-- TOC entry 5788 (class 0 OID 0)
-- Dependencies: 286
-- Name: vendor_payouts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_payouts_id_seq OWNED BY public.vendor_payouts.id;


--
-- TOC entry 287 (class 1259 OID 44441)
-- Name: vendor_products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_products (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    product_name character varying(255) NOT NULL,
    description text,
    category character varying(100),
    price numeric(10,2) NOT NULL,
    stock_quantity integer DEFAULT 0,
    status character varying(50) DEFAULT 'active'::character varying,
    image_url character varying(500),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vendor_products OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 44454)
-- Name: vendor_products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_products_id_seq OWNER TO postgres;

--
-- TOC entry 5789 (class 0 OID 0)
-- Dependencies: 288
-- Name: vendor_products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_products_id_seq OWNED BY public.vendor_products.id;


--
-- TOC entry 289 (class 1259 OID 44455)
-- Name: vendor_ratings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_ratings (
    id integer NOT NULL,
    booking_id integer NOT NULL,
    vendor_id integer NOT NULL,
    user_id integer NOT NULL,
    rating numeric(3,1),
    review_text text,
    response_from_vendor text,
    is_verified_purchase boolean DEFAULT true,
    helpful_count integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT vendor_ratings_rating_check CHECK (((rating >= (1)::numeric) AND (rating <= (5)::numeric)))
);


ALTER TABLE public.vendor_ratings OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 44469)
-- Name: vendor_ratings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_ratings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_ratings_id_seq OWNER TO postgres;

--
-- TOC entry 5790 (class 0 OID 0)
-- Dependencies: 290
-- Name: vendor_ratings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_ratings_id_seq OWNED BY public.vendor_ratings.id;


--
-- TOC entry 291 (class 1259 OID 44470)
-- Name: vendor_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_services (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    quick_service_id integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vendor_services OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 44478)
-- Name: vendor_services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_services_id_seq OWNER TO postgres;

--
-- TOC entry 5791 (class 0 OID 0)
-- Dependencies: 292
-- Name: vendor_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_services_id_seq OWNED BY public.vendor_services.id;


--
-- TOC entry 293 (class 1259 OID 44479)
-- Name: vendor_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendor_stats (
    id integer NOT NULL,
    vendor_id integer NOT NULL,
    total_products integer DEFAULT 0,
    total_orders integer DEFAULT 0,
    total_revenue numeric(15,2) DEFAULT 0.00,
    active_sales integer DEFAULT 0,
    total_customers integer DEFAULT 0,
    average_rating numeric(3,2) DEFAULT 0.00,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.vendor_stats OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 44491)
-- Name: vendor_stats_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendor_stats_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendor_stats_id_seq OWNER TO postgres;

--
-- TOC entry 5792 (class 0 OID 0)
-- Dependencies: 294
-- Name: vendor_stats_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendor_stats_id_seq OWNED BY public.vendor_stats.id;


--
-- TOC entry 295 (class 1259 OID 44492)
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) CONSTRAINT vendors_password_not_null NOT NULL,
    shop_name character varying(255) NOT NULL,
    business_name character varying(255) NOT NULL,
    phone character varying(20),
    city character varying(100),
    state character varying(100),
    country character varying(100),
    postal_code character varying(20),
    business_type character varying(100),
    description text,
    logo_url character varying(500),
    banner_url character varying(500),
    bank_account_holder character varying(255),
    bank_account_number character varying(50),
    bank_name character varying(255),
    bank_ifsc_code character varying(20),
    gst_number character varying(50),
    pan_number character varying(50),
    business_registration_number character varying(100),
    status character varying(50) DEFAULT 'active'::character varying,
    verification_status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login timestamp without time zone,
    is_approved boolean DEFAULT false,
    approval_date timestamp without time zone,
    aadhar_number text,
    profile_photo bytea,
    profile_photo_mime text,
    aadhar_image bytea,
    aadhar_image_mime text,
    profile_photo_url text,
    aadhar_image_url text,
    package_id text,
    package_name text,
    package_price numeric DEFAULT 0,
    package_duration_months integer DEFAULT 0,
    package_purchased_at timestamp with time zone,
    package_starts_at timestamp with time zone,
    package_expires_at timestamp with time zone,
    package_status text DEFAULT 'none'::text
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 44507)
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO postgres;

--
-- TOC entry 5793 (class 0 OID 0)
-- Dependencies: 296
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- TOC entry 5124 (class 2604 OID 44508)
-- Name: aadhaar_otp_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aadhaar_otp_log ALTER COLUMN id SET DEFAULT nextval('public.aadhaar_otp_log_id_seq'::regclass);


--
-- TOC entry 5127 (class 2604 OID 44509)
-- Name: admin_activity_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_activity_logs ALTER COLUMN id SET DEFAULT nextval('public.admin_activity_logs_id_seq'::regclass);


--
-- TOC entry 5350 (class 2604 OID 45298)
-- Name: agent_leads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_leads ALTER COLUMN id SET DEFAULT nextval('public.agent_leads_id_seq'::regclass);


--
-- TOC entry 5361 (class 2604 OID 45320)
-- Name: agent_schedule id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_schedule ALTER COLUMN id SET DEFAULT nextval('public.agent_schedule_id_seq'::regclass);


--
-- TOC entry 5129 (class 2604 OID 44510)
-- Name: agents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents ALTER COLUMN id SET DEFAULT nextval('public.agents_id_seq'::regclass);


--
-- TOC entry 5135 (class 2604 OID 44511)
-- Name: booking_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_messages ALTER COLUMN id SET DEFAULT nextval('public.booking_messages_id_seq'::regclass);


--
-- TOC entry 5137 (class 2604 OID 44512)
-- Name: booking_ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_ratings ALTER COLUMN id SET DEFAULT nextval('public.booking_ratings_id_seq'::regclass);


--
-- TOC entry 5140 (class 2604 OID 44513)
-- Name: calculator_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calculator_categories ALTER COLUMN id SET DEFAULT nextval('public.calculator_categories_id_seq'::regclass);


--
-- TOC entry 5147 (class 2604 OID 44514)
-- Name: calculator_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calculator_products ALTER COLUMN id SET DEFAULT nextval('public.calculator_products_id_seq'::regclass);


--
-- TOC entry 5389 (class 2604 OID 48641)
-- Name: calculator_quote_otps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calculator_quote_otps ALTER COLUMN id SET DEFAULT nextval('public.calculator_quote_otps_id_seq'::regclass);


--
-- TOC entry 5162 (class 2604 OID 44515)
-- Name: career_enquiries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_enquiries ALTER COLUMN id SET DEFAULT nextval('public.career_enquiries_id_seq'::regclass);


--
-- TOC entry 5165 (class 2604 OID 44516)
-- Name: contact_submissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions ALTER COLUMN id SET DEFAULT nextval('public.contact_submissions_id_seq'::regclass);


--
-- TOC entry 5169 (class 2604 OID 44517)
-- Name: franchises id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.franchises ALTER COLUMN id SET DEFAULT nextval('public.franchises_id_seq'::regclass);


--
-- TOC entry 5172 (class 2604 OID 44518)
-- Name: free_time_slots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.free_time_slots ALTER COLUMN id SET DEFAULT nextval('public.free_time_slots_id_seq'::regclass);


--
-- TOC entry 5177 (class 2604 OID 44519)
-- Name: hero_banners id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hero_banners ALTER COLUMN id SET DEFAULT nextval('public.hero_banners_id_seq'::regclass);


--
-- TOC entry 5183 (class 2604 OID 44520)
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- TOC entry 5192 (class 2604 OID 44521)
-- Name: material_enquiries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_enquiries ALTER COLUMN id SET DEFAULT nextval('public.material_enquiries_id_seq'::regclass);


--
-- TOC entry 5197 (class 2604 OID 44522)
-- Name: password_reset_otps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_otps ALTER COLUMN id SET DEFAULT nextval('public.password_reset_otps_id_seq'::regclass);


--
-- TOC entry 5200 (class 2604 OID 44523)
-- Name: primary_service_enquiries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_service_enquiries ALTER COLUMN id SET DEFAULT nextval('public.primary_service_enquiries_id_seq'::regclass);


--
-- TOC entry 5203 (class 2604 OID 44524)
-- Name: primary_services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_services ALTER COLUMN id SET DEFAULT nextval('public.primary_services_id_seq'::regclass);


--
-- TOC entry 5209 (class 2604 OID 44525)
-- Name: professional_enquiries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_enquiries ALTER COLUMN id SET DEFAULT nextval('public.professional_enquiries_id_seq'::regclass);


--
-- TOC entry 5212 (class 2604 OID 44526)
-- Name: professional_services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_services ALTER COLUMN id SET DEFAULT nextval('public.professional_services_id_seq'::regclass);


--
-- TOC entry 5381 (class 2604 OID 45443)
-- Name: project_expenses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_expenses ALTER COLUMN id SET DEFAULT nextval('public.project_expenses_id_seq'::regclass);


--
-- TOC entry 5369 (class 2604 OID 45386)
-- Name: project_labour_entries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_labour_entries ALTER COLUMN id SET DEFAULT nextval('public.project_labour_entries_id_seq'::regclass);


--
-- TOC entry 5375 (class 2604 OID 45414)
-- Name: project_material_entries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_material_entries ALTER COLUMN id SET DEFAULT nextval('public.project_material_entries_id_seq'::regclass);


--
-- TOC entry 5385 (class 2604 OID 45470)
-- Name: project_media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_media ALTER COLUMN id SET DEFAULT nextval('public.project_media_id_seq'::regclass);


--
-- TOC entry 5365 (class 2604 OID 45360)
-- Name: project_payments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_payments ALTER COLUMN id SET DEFAULT nextval('public.project_payments_id_seq'::regclass);


--
-- TOC entry 5220 (class 2604 OID 44527)
-- Name: projects id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN id SET DEFAULT nextval('public.projects_id_seq'::regclass);


--
-- TOC entry 5227 (class 2604 OID 44528)
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- TOC entry 5235 (class 2604 OID 44529)
-- Name: quick_services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quick_services ALTER COLUMN id SET DEFAULT nextval('public.quick_services_id_seq'::regclass);


--
-- TOC entry 5240 (class 2604 OID 44530)
-- Name: service_bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_bookings ALTER COLUMN id SET DEFAULT nextval('public.service_bookings_id_seq'::regclass);


--
-- TOC entry 5254 (class 2604 OID 44531)
-- Name: service_notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_notifications ALTER COLUMN id SET DEFAULT nextval('public.service_notifications_id_seq'::regclass);


--
-- TOC entry 5260 (class 2604 OID 44532)
-- Name: shop_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shop_categories ALTER COLUMN id SET DEFAULT nextval('public.shop_categories_id_seq'::regclass);


--
-- TOC entry 5273 (class 2604 OID 44533)
-- Name: supplier_categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_categories ALTER COLUMN id SET DEFAULT nextval('public.supplier_categories_id_seq'::regclass);


--
-- TOC entry 5278 (class 2604 OID 44534)
-- Name: supplier_materials id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_materials ALTER COLUMN id SET DEFAULT nextval('public.supplier_materials_id_seq'::regclass);


--
-- TOC entry 5283 (class 2604 OID 44535)
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- TOC entry 5294 (class 2604 OID 44536)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5297 (class 2604 OID 44537)
-- Name: vendor_availability id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_availability ALTER COLUMN id SET DEFAULT nextval('public.vendor_availability_id_seq'::regclass);


--
-- TOC entry 5300 (class 2604 OID 44538)
-- Name: vendor_average_ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_average_ratings ALTER COLUMN id SET DEFAULT nextval('public.vendor_average_ratings_id_seq'::regclass);


--
-- TOC entry 5313 (class 2604 OID 44539)
-- Name: vendor_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_orders ALTER COLUMN id SET DEFAULT nextval('public.vendor_orders_id_seq'::regclass);


--
-- TOC entry 5317 (class 2604 OID 44540)
-- Name: vendor_payouts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_payouts ALTER COLUMN id SET DEFAULT nextval('public.vendor_payouts_id_seq'::regclass);


--
-- TOC entry 5320 (class 2604 OID 44541)
-- Name: vendor_products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_products ALTER COLUMN id SET DEFAULT nextval('public.vendor_products_id_seq'::regclass);


--
-- TOC entry 5325 (class 2604 OID 44542)
-- Name: vendor_ratings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_ratings ALTER COLUMN id SET DEFAULT nextval('public.vendor_ratings_id_seq'::regclass);


--
-- TOC entry 5330 (class 2604 OID 44543)
-- Name: vendor_services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_services ALTER COLUMN id SET DEFAULT nextval('public.vendor_services_id_seq'::regclass);


--
-- TOC entry 5333 (class 2604 OID 44544)
-- Name: vendor_stats id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_stats ALTER COLUMN id SET DEFAULT nextval('public.vendor_stats_id_seq'::regclass);


--
-- TOC entry 5341 (class 2604 OID 44545)
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- TOC entry 5404 (class 2606 OID 44563)
-- Name: aadhaar_otp_log aadhaar_otp_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aadhaar_otp_log
    ADD CONSTRAINT aadhaar_otp_log_pkey PRIMARY KEY (id);


--
-- TOC entry 5407 (class 2606 OID 44565)
-- Name: admin_activity_logs admin_activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_activity_logs
    ADD CONSTRAINT admin_activity_logs_pkey PRIMARY KEY (id);


--
-- TOC entry 5541 (class 2606 OID 45310)
-- Name: agent_leads agent_leads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_leads
    ADD CONSTRAINT agent_leads_pkey PRIMARY KEY (id);


--
-- TOC entry 5543 (class 2606 OID 45332)
-- Name: agent_schedule agent_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_schedule
    ADD CONSTRAINT agent_schedule_pkey PRIMARY KEY (id);


--
-- TOC entry 5409 (class 2606 OID 44567)
-- Name: agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- TOC entry 5411 (class 2606 OID 44569)
-- Name: booking_messages booking_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_messages
    ADD CONSTRAINT booking_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 5413 (class 2606 OID 44571)
-- Name: booking_ratings booking_ratings_booking_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_ratings
    ADD CONSTRAINT booking_ratings_booking_id_key UNIQUE (booking_id);


--
-- TOC entry 5415 (class 2606 OID 44573)
-- Name: booking_ratings booking_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_ratings
    ADD CONSTRAINT booking_ratings_pkey PRIMARY KEY (id);


--
-- TOC entry 5417 (class 2606 OID 44575)
-- Name: calculator_categories calculator_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calculator_categories
    ADD CONSTRAINT calculator_categories_name_key UNIQUE (name);


--
-- TOC entry 5419 (class 2606 OID 44577)
-- Name: calculator_categories calculator_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calculator_categories
    ADD CONSTRAINT calculator_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5422 (class 2606 OID 44579)
-- Name: calculator_products calculator_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calculator_products
    ADD CONSTRAINT calculator_products_pkey PRIMARY KEY (id);


--
-- TOC entry 5555 (class 2606 OID 48655)
-- Name: calculator_quote_otps calculator_quote_otps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calculator_quote_otps
    ADD CONSTRAINT calculator_quote_otps_pkey PRIMARY KEY (id);


--
-- TOC entry 5424 (class 2606 OID 44581)
-- Name: calculator_settings calculator_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calculator_settings
    ADD CONSTRAINT calculator_settings_pkey PRIMARY KEY (id);


--
-- TOC entry 5426 (class 2606 OID 44583)
-- Name: career_enquiries career_enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career_enquiries
    ADD CONSTRAINT career_enquiries_pkey PRIMARY KEY (id);


--
-- TOC entry 5428 (class 2606 OID 44585)
-- Name: contact_submissions contact_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_submissions
    ADD CONSTRAINT contact_submissions_pkey PRIMARY KEY (id);


--
-- TOC entry 5433 (class 2606 OID 44587)
-- Name: franchises franchises_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.franchises
    ADD CONSTRAINT franchises_pkey PRIMARY KEY (id);


--
-- TOC entry 5435 (class 2606 OID 44589)
-- Name: free_time_slots free_time_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.free_time_slots
    ADD CONSTRAINT free_time_slots_pkey PRIMARY KEY (id);


--
-- TOC entry 5437 (class 2606 OID 44591)
-- Name: free_time_slots free_time_slots_quick_service_id_slot_date_slot_start_city_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.free_time_slots
    ADD CONSTRAINT free_time_slots_quick_service_id_slot_date_slot_start_city_key UNIQUE (quick_service_id, slot_date, slot_start, city);


--
-- TOC entry 5441 (class 2606 OID 44593)
-- Name: hero_banners hero_banners_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hero_banners
    ADD CONSTRAINT hero_banners_pkey PRIMARY KEY (id);


--
-- TOC entry 5443 (class 2606 OID 44595)
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- TOC entry 5445 (class 2606 OID 44597)
-- Name: material_enquiries material_enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.material_enquiries
    ADD CONSTRAINT material_enquiries_pkey PRIMARY KEY (id);


--
-- TOC entry 5448 (class 2606 OID 44599)
-- Name: password_reset_otps password_reset_otps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_otps
    ADD CONSTRAINT password_reset_otps_pkey PRIMARY KEY (id);


--
-- TOC entry 5450 (class 2606 OID 44601)
-- Name: primary_service_enquiries primary_service_enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_service_enquiries
    ADD CONSTRAINT primary_service_enquiries_pkey PRIMARY KEY (id);


--
-- TOC entry 5453 (class 2606 OID 44603)
-- Name: primary_services primary_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_services
    ADD CONSTRAINT primary_services_pkey PRIMARY KEY (id);


--
-- TOC entry 5455 (class 2606 OID 44605)
-- Name: primary_services primary_services_slug_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.primary_services
    ADD CONSTRAINT primary_services_slug_key UNIQUE (slug);


--
-- TOC entry 5457 (class 2606 OID 44607)
-- Name: professional_enquiries professional_enquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_enquiries
    ADD CONSTRAINT professional_enquiries_pkey PRIMARY KEY (id);


--
-- TOC entry 5459 (class 2606 OID 44609)
-- Name: professional_services professional_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.professional_services
    ADD CONSTRAINT professional_services_pkey PRIMARY KEY (id);


--
-- TOC entry 5551 (class 2606 OID 45455)
-- Name: project_expenses project_expenses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_expenses
    ADD CONSTRAINT project_expenses_pkey PRIMARY KEY (id);


--
-- TOC entry 5547 (class 2606 OID 45399)
-- Name: project_labour_entries project_labour_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_labour_entries
    ADD CONSTRAINT project_labour_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 5549 (class 2606 OID 45428)
-- Name: project_material_entries project_material_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_material_entries
    ADD CONSTRAINT project_material_entries_pkey PRIMARY KEY (id);


--
-- TOC entry 5553 (class 2606 OID 45481)
-- Name: project_media project_media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_media
    ADD CONSTRAINT project_media_pkey PRIMARY KEY (id);


--
-- TOC entry 5545 (class 2606 OID 45371)
-- Name: project_payments project_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_payments
    ADD CONSTRAINT project_payments_pkey PRIMARY KEY (id);


--
-- TOC entry 5461 (class 2606 OID 44611)
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- TOC entry 5467 (class 2606 OID 44613)
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- TOC entry 5470 (class 2606 OID 44615)
-- Name: quick_services quick_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quick_services
    ADD CONSTRAINT quick_services_pkey PRIMARY KEY (id);


--
-- TOC entry 5478 (class 2606 OID 44617)
-- Name: service_bookings service_bookings_booking_reference_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_booking_reference_key UNIQUE (booking_reference);


--
-- TOC entry 5480 (class 2606 OID 44619)
-- Name: service_bookings service_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 5485 (class 2606 OID 44621)
-- Name: service_notifications service_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_notifications
    ADD CONSTRAINT service_notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 5487 (class 2606 OID 44623)
-- Name: shop_categories shop_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shop_categories
    ADD CONSTRAINT shop_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5490 (class 2606 OID 44625)
-- Name: supplier_categories supplier_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_categories
    ADD CONSTRAINT supplier_categories_pkey PRIMARY KEY (id);


--
-- TOC entry 5492 (class 2606 OID 44627)
-- Name: supplier_materials supplier_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_materials
    ADD CONSTRAINT supplier_materials_pkey PRIMARY KEY (id);


--
-- TOC entry 5494 (class 2606 OID 44629)
-- Name: suppliers suppliers_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_email_key UNIQUE (email);


--
-- TOC entry 5496 (class 2606 OID 44631)
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- TOC entry 5499 (class 2606 OID 44633)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 5501 (class 2606 OID 44635)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 5503 (class 2606 OID 44637)
-- Name: vendor_availability vendor_availability_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_availability
    ADD CONSTRAINT vendor_availability_pkey PRIMARY KEY (id);


--
-- TOC entry 5505 (class 2606 OID 44639)
-- Name: vendor_availability vendor_availability_vendor_id_day_of_week_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_availability
    ADD CONSTRAINT vendor_availability_vendor_id_day_of_week_key UNIQUE (vendor_id, day_of_week);


--
-- TOC entry 5507 (class 2606 OID 44641)
-- Name: vendor_average_ratings vendor_average_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_average_ratings
    ADD CONSTRAINT vendor_average_ratings_pkey PRIMARY KEY (id);


--
-- TOC entry 5509 (class 2606 OID 44643)
-- Name: vendor_average_ratings vendor_average_ratings_vendor_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_average_ratings
    ADD CONSTRAINT vendor_average_ratings_vendor_id_key UNIQUE (vendor_id);


--
-- TOC entry 5511 (class 2606 OID 44645)
-- Name: vendor_orders vendor_orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_orders
    ADD CONSTRAINT vendor_orders_order_number_key UNIQUE (order_number);


--
-- TOC entry 5513 (class 2606 OID 44647)
-- Name: vendor_orders vendor_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_orders
    ADD CONSTRAINT vendor_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 5515 (class 2606 OID 44649)
-- Name: vendor_payouts vendor_payouts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_payouts
    ADD CONSTRAINT vendor_payouts_pkey PRIMARY KEY (id);


--
-- TOC entry 5517 (class 2606 OID 44651)
-- Name: vendor_products vendor_products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_products
    ADD CONSTRAINT vendor_products_pkey PRIMARY KEY (id);


--
-- TOC entry 5521 (class 2606 OID 44653)
-- Name: vendor_ratings vendor_ratings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_ratings
    ADD CONSTRAINT vendor_ratings_pkey PRIMARY KEY (id);


--
-- TOC entry 5524 (class 2606 OID 44655)
-- Name: vendor_services vendor_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_services
    ADD CONSTRAINT vendor_services_pkey PRIMARY KEY (id);


--
-- TOC entry 5526 (class 2606 OID 44657)
-- Name: vendor_services vendor_services_vendor_id_quick_service_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_services
    ADD CONSTRAINT vendor_services_vendor_id_quick_service_id_key UNIQUE (vendor_id, quick_service_id);


--
-- TOC entry 5528 (class 2606 OID 44659)
-- Name: vendor_stats vendor_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_stats
    ADD CONSTRAINT vendor_stats_pkey PRIMARY KEY (vendor_id);


--
-- TOC entry 5530 (class 2606 OID 44661)
-- Name: vendor_stats vendor_stats_vendor_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_stats
    ADD CONSTRAINT vendor_stats_vendor_id_unique UNIQUE (vendor_id);


--
-- TOC entry 5537 (class 2606 OID 44663)
-- Name: vendors vendors_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_email_key UNIQUE (email);


--
-- TOC entry 5539 (class 2606 OID 44665)
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- TOC entry 5420 (class 1259 OID 44666)
-- Name: calculator_products_category_name_uidx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX calculator_products_category_name_uidx ON public.calculator_products USING btree (lower((category)::text), lower((name)::text));


--
-- TOC entry 5405 (class 1259 OID 44667)
-- Name: idx_aadhaar_otp_log_supplier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_aadhaar_otp_log_supplier_id ON public.aadhaar_otp_log USING btree (supplier_id);


--
-- TOC entry 5429 (class 1259 OID 44668)
-- Name: idx_contact_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_created ON public.contact_submissions USING btree (created_at DESC);


--
-- TOC entry 5430 (class 1259 OID 44669)
-- Name: idx_contact_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_email ON public.contact_submissions USING btree (email);


--
-- TOC entry 5431 (class 1259 OID 44670)
-- Name: idx_contact_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contact_status ON public.contact_submissions USING btree (status);


--
-- TOC entry 5438 (class 1259 OID 44671)
-- Name: idx_free_slots_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_free_slots_date ON public.free_time_slots USING btree (slot_date);


--
-- TOC entry 5439 (class 1259 OID 44672)
-- Name: idx_free_slots_service_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_free_slots_service_city ON public.free_time_slots USING btree (quick_service_id, city);


--
-- TOC entry 5451 (class 1259 OID 44673)
-- Name: idx_primary_services_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_primary_services_slug ON public.primary_services USING btree (slug);


--
-- TOC entry 5446 (class 1259 OID 44674)
-- Name: idx_pro_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_pro_email ON public.password_reset_otps USING btree (email, user_type);


--
-- TOC entry 5462 (class 1259 OID 44675)
-- Name: idx_properties_listing_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_listing_type ON public.properties USING btree (listing_type);


--
-- TOC entry 5463 (class 1259 OID 44676)
-- Name: idx_properties_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_location ON public.properties USING btree (location);


--
-- TOC entry 5464 (class 1259 OID 44677)
-- Name: idx_properties_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_status ON public.properties USING btree (status);


--
-- TOC entry 5465 (class 1259 OID 44678)
-- Name: idx_properties_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_properties_type ON public.properties USING btree (type);


--
-- TOC entry 5468 (class 1259 OID 44679)
-- Name: idx_quick_services_label; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_quick_services_label ON public.quick_services USING btree (label);


--
-- TOC entry 5518 (class 1259 OID 44680)
-- Name: idx_ratings_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ratings_booking_id ON public.vendor_ratings USING btree (booking_id);


--
-- TOC entry 5519 (class 1259 OID 44681)
-- Name: idx_ratings_vendor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ratings_vendor_id ON public.vendor_ratings USING btree (vendor_id);


--
-- TOC entry 5471 (class 1259 OID 44682)
-- Name: idx_service_bookings_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_bookings_city ON public.service_bookings USING btree (service_city);


--
-- TOC entry 5472 (class 1259 OID 44683)
-- Name: idx_service_bookings_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_bookings_date ON public.service_bookings USING btree (booking_date);


--
-- TOC entry 5473 (class 1259 OID 44684)
-- Name: idx_service_bookings_service_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_bookings_service_id ON public.service_bookings USING btree (quick_service_id);


--
-- TOC entry 5474 (class 1259 OID 44685)
-- Name: idx_service_bookings_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_bookings_status ON public.service_bookings USING btree (status);


--
-- TOC entry 5475 (class 1259 OID 44686)
-- Name: idx_service_bookings_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_bookings_user_id ON public.service_bookings USING btree (user_id);


--
-- TOC entry 5476 (class 1259 OID 44687)
-- Name: idx_service_bookings_vendor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_bookings_vendor_id ON public.service_bookings USING btree (vendor_id);


--
-- TOC entry 5481 (class 1259 OID 44688)
-- Name: idx_service_notifications_booking_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_notifications_booking_id ON public.service_notifications USING btree (booking_id);


--
-- TOC entry 5482 (class 1259 OID 44689)
-- Name: idx_service_notifications_notification_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_notifications_notification_status ON public.service_notifications USING btree (notification_status);


--
-- TOC entry 5483 (class 1259 OID 44690)
-- Name: idx_service_notifications_vendor_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_service_notifications_vendor_id ON public.service_notifications USING btree (vendor_id);


--
-- TOC entry 5488 (class 1259 OID 44691)
-- Name: idx_supplier_categories_supplier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_categories_supplier_id ON public.supplier_categories USING btree (supplier_id);


--
-- TOC entry 5497 (class 1259 OID 44692)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 5531 (class 1259 OID 44693)
-- Name: idx_vendor_city; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendor_city ON public.vendors USING btree (city);


--
-- TOC entry 5522 (class 1259 OID 44694)
-- Name: idx_vendor_services; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendor_services ON public.vendor_services USING btree (vendor_id, quick_service_id);


--
-- TOC entry 5532 (class 1259 OID 44695)
-- Name: idx_vendor_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendor_status ON public.vendors USING btree (status, verification_status);


--
-- TOC entry 5533 (class 1259 OID 44696)
-- Name: idx_vendors_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendors_email ON public.vendors USING btree (email);


--
-- TOC entry 5534 (class 1259 OID 44697)
-- Name: idx_vendors_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendors_status ON public.vendors USING btree (status);


--
-- TOC entry 5535 (class 1259 OID 44698)
-- Name: idx_vendors_verification_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vendors_verification_status ON public.vendors USING btree (verification_status);


--
-- TOC entry 5594 (class 2620 OID 44699)
-- Name: supplier_categories trg_supplier_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_supplier_categories_updated_at BEFORE UPDATE ON public.supplier_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 5556 (class 2606 OID 44700)
-- Name: aadhaar_otp_log aadhaar_otp_log_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aadhaar_otp_log
    ADD CONSTRAINT aadhaar_otp_log_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- TOC entry 5557 (class 2606 OID 44705)
-- Name: admin_activity_logs admin_activity_logs_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_activity_logs
    ADD CONSTRAINT admin_activity_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- TOC entry 5582 (class 2606 OID 45311)
-- Name: agent_leads agent_leads_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_leads
    ADD CONSTRAINT agent_leads_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;


--
-- TOC entry 5583 (class 2606 OID 45333)
-- Name: agent_schedule agent_schedule_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agent_schedule
    ADD CONSTRAINT agent_schedule_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;


--
-- TOC entry 5558 (class 2606 OID 44710)
-- Name: booking_messages booking_messages_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_messages
    ADD CONSTRAINT booking_messages_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.service_bookings(id) ON DELETE CASCADE;


--
-- TOC entry 5559 (class 2606 OID 44715)
-- Name: booking_ratings booking_ratings_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_ratings
    ADD CONSTRAINT booking_ratings_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.service_bookings(id);


--
-- TOC entry 5560 (class 2606 OID 44720)
-- Name: booking_ratings booking_ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_ratings
    ADD CONSTRAINT booking_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- TOC entry 5561 (class 2606 OID 44725)
-- Name: booking_ratings booking_ratings_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.booking_ratings
    ADD CONSTRAINT booking_ratings_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- TOC entry 5562 (class 2606 OID 44730)
-- Name: free_time_slots free_time_slots_quick_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.free_time_slots
    ADD CONSTRAINT free_time_slots_quick_service_id_fkey FOREIGN KEY (quick_service_id) REFERENCES public.quick_services(id) ON DELETE CASCADE;


--
-- TOC entry 5590 (class 2606 OID 45461)
-- Name: project_expenses project_expenses_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_expenses
    ADD CONSTRAINT project_expenses_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- TOC entry 5591 (class 2606 OID 45456)
-- Name: project_expenses project_expenses_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_expenses
    ADD CONSTRAINT project_expenses_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 5586 (class 2606 OID 45405)
-- Name: project_labour_entries project_labour_entries_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_labour_entries
    ADD CONSTRAINT project_labour_entries_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- TOC entry 5587 (class 2606 OID 45400)
-- Name: project_labour_entries project_labour_entries_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_labour_entries
    ADD CONSTRAINT project_labour_entries_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 5588 (class 2606 OID 45434)
-- Name: project_material_entries project_material_entries_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_material_entries
    ADD CONSTRAINT project_material_entries_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- TOC entry 5589 (class 2606 OID 45429)
-- Name: project_material_entries project_material_entries_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_material_entries
    ADD CONSTRAINT project_material_entries_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 5592 (class 2606 OID 45487)
-- Name: project_media project_media_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_media
    ADD CONSTRAINT project_media_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- TOC entry 5593 (class 2606 OID 45482)
-- Name: project_media project_media_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_media
    ADD CONSTRAINT project_media_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 5584 (class 2606 OID 45377)
-- Name: project_payments project_payments_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_payments
    ADD CONSTRAINT project_payments_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE SET NULL;


--
-- TOC entry 5585 (class 2606 OID 45372)
-- Name: project_payments project_payments_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.project_payments
    ADD CONSTRAINT project_payments_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- TOC entry 5563 (class 2606 OID 44735)
-- Name: service_bookings service_bookings_quick_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_quick_service_id_fkey FOREIGN KEY (quick_service_id) REFERENCES public.quick_services(id);


--
-- TOC entry 5564 (class 2606 OID 44740)
-- Name: service_bookings service_bookings_time_slot_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_time_slot_id_fkey FOREIGN KEY (time_slot_id) REFERENCES public.free_time_slots(id);


--
-- TOC entry 5565 (class 2606 OID 44745)
-- Name: service_bookings service_bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5566 (class 2606 OID 44750)
-- Name: service_bookings service_bookings_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_bookings
    ADD CONSTRAINT service_bookings_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL;


--
-- TOC entry 5567 (class 2606 OID 44755)
-- Name: service_notifications service_notifications_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_notifications
    ADD CONSTRAINT service_notifications_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.service_bookings(id) ON DELETE CASCADE;


--
-- TOC entry 5568 (class 2606 OID 44760)
-- Name: service_notifications service_notifications_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_notifications
    ADD CONSTRAINT service_notifications_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.quick_services(id);


--
-- TOC entry 5569 (class 2606 OID 44765)
-- Name: service_notifications service_notifications_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.service_notifications
    ADD CONSTRAINT service_notifications_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 5570 (class 2606 OID 44770)
-- Name: supplier_categories supplier_categories_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_categories
    ADD CONSTRAINT supplier_categories_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- TOC entry 5571 (class 2606 OID 44775)
-- Name: vendor_availability vendor_availability_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_availability
    ADD CONSTRAINT vendor_availability_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 5572 (class 2606 OID 44780)
-- Name: vendor_average_ratings vendor_average_ratings_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_average_ratings
    ADD CONSTRAINT vendor_average_ratings_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id);


--
-- TOC entry 5573 (class 2606 OID 44785)
-- Name: vendor_orders vendor_orders_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_orders
    ADD CONSTRAINT vendor_orders_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 5574 (class 2606 OID 44790)
-- Name: vendor_payouts vendor_payouts_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_payouts
    ADD CONSTRAINT vendor_payouts_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 5575 (class 2606 OID 44795)
-- Name: vendor_products vendor_products_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_products
    ADD CONSTRAINT vendor_products_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 5576 (class 2606 OID 44800)
-- Name: vendor_ratings vendor_ratings_booking_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_ratings
    ADD CONSTRAINT vendor_ratings_booking_id_fkey FOREIGN KEY (booking_id) REFERENCES public.service_bookings(id) ON DELETE CASCADE;


--
-- TOC entry 5577 (class 2606 OID 44805)
-- Name: vendor_ratings vendor_ratings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_ratings
    ADD CONSTRAINT vendor_ratings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 5578 (class 2606 OID 44810)
-- Name: vendor_ratings vendor_ratings_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_ratings
    ADD CONSTRAINT vendor_ratings_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 5579 (class 2606 OID 44815)
-- Name: vendor_services vendor_services_quick_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_services
    ADD CONSTRAINT vendor_services_quick_service_id_fkey FOREIGN KEY (quick_service_id) REFERENCES public.quick_services(id) ON DELETE CASCADE;


--
-- TOC entry 5580 (class 2606 OID 44820)
-- Name: vendor_services vendor_services_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_services
    ADD CONSTRAINT vendor_services_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


--
-- TOC entry 5581 (class 2606 OID 44825)
-- Name: vendor_stats vendor_stats_vendor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendor_stats
    ADD CONSTRAINT vendor_stats_vendor_id_fkey FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE CASCADE;


-- Completed on 2026-07-15 15:03:20

--
-- PostgreSQL database dump complete
--

\unrestrict 5WgJ1C7DGfDhUB26udtEZ5LdM3ue7BQWb3WphtfMAjjaz4wX0G9RQ8mFAqh67sw

