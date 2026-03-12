-- ============================================
-- PeptideIndex SEO Architecture Seed Data
-- Run in Supabase SQL Editor (Dashboard > SQL > New Query)
-- This script is idempotent (safe to run multiple times)
-- ============================================

BEGIN;

-- Add 'legal' to page_type enum if not already present
DO $$ BEGIN
  ALTER TYPE page_type ADD VALUE IF NOT EXISTS 'legal';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMIT;
BEGIN;

-- ============================================
-- 1. PEPTIDES (5 records)
-- ============================================

INSERT INTO peptides (slug, name, alternative_names, summary, description, molecular_weight, category, status)
VALUES
(
  'bpc-157',
  'BPC-157',
  ARRAY['Body Protection Compound-157', 'PL-10', 'PL 14736'],
  'A synthetic pentadecapeptide derived from a protective protein found in human gastric juice, investigated in preclinical research for tissue repair and gastrointestinal protection.',
  'BPC-157 is a 15-amino-acid peptide fragment of body protection compound (BPC), a protein naturally occurring in human gastric juice. It has been extensively studied in animal models for its potential protective and regenerative properties across multiple tissue types. BPC-157 is not currently approved by the FDA for any medical indication. All research references on this page relate to preclinical or early-stage studies.',
  '~1419.5 Da',
  'Healing & Recovery',
  'published'
),
(
  'tb-500',
  'TB-500',
  ARRAY['Thymosin Beta-4 Fragment'],
  'A synthetic peptide fragment of thymosin beta-4, a naturally occurring protein involved in cell migration and tissue repair, studied primarily in preclinical research.',
  'TB-500 is a synthetic version of a region of thymosin beta-4, a 43-amino-acid protein present in most human tissues. Thymosin beta-4 plays a role in cell motility, blood vessel formation, and tissue repair. TB-500 research has focused on wound healing, inflammation modulation, and recovery from musculoskeletal injuries in animal models. It is not FDA-approved for any human medical condition.',
  '~4963 Da',
  'Healing & Recovery',
  'published'
),
(
  'ipamorelin',
  'Ipamorelin',
  ARRAY['IPAM', 'NNC 26-0161'],
  'A selective growth hormone secretagogue peptide studied for its ability to stimulate growth hormone release with fewer side effects compared to earlier secretagogues.',
  'Ipamorelin is a pentapeptide that acts as a selective agonist of the ghrelin/growth hormone secretagogue receptor (GHS-R). Unlike earlier growth hormone secretagogues, ipamorelin has been noted in research for its selectivity in stimulating growth hormone release without significantly affecting cortisol or prolactin levels. It has been studied in clinical settings for post-surgical recovery.',
  '~711.9 Da',
  'Growth Hormone Secretagogue',
  'published'
),
(
  'cjc-1295',
  'CJC-1295',
  ARRAY['CJC-1295 DAC', 'Modified GRF 1-29'],
  'A synthetic analog of growth hormone-releasing hormone (GHRH) designed for sustained growth hormone elevation through extended half-life.',
  'CJC-1295 is a synthetic peptide analog of growth hormone-releasing hormone (GHRH) with 29 amino acids. It was developed to extend the half-life of GHRH through drug affinity complex (DAC) technology, allowing for sustained elevation of growth hormone and IGF-1 levels. CJC-1295 is often studied in combination with ipamorelin.',
  '~3367.9 Da',
  'Growth Hormone Secretagogue',
  'published'
),
(
  'semaglutide',
  'Semaglutide',
  ARRAY['Ozempic', 'Wegovy', 'Rybelsus'],
  'An FDA-approved GLP-1 receptor agonist prescribed for type 2 diabetes management and chronic weight management in eligible patients.',
  'Semaglutide is a glucagon-like peptide-1 (GLP-1) receptor agonist that has received FDA approval for the treatment of type 2 diabetes (marketed as Ozempic and Rybelsus) and for chronic weight management (marketed as Wegovy). It works by mimicking the incretin hormone GLP-1, which helps regulate blood sugar levels and appetite. Semaglutide is only available by prescription.',
  '~4113.6 Da',
  'GLP-1 Receptor Agonist',
  'published'
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  alternative_names = EXCLUDED.alternative_names,
  summary = EXCLUDED.summary,
  description = EXCLUDED.description,
  molecular_weight = EXCLUDED.molecular_weight,
  category = EXCLUDED.category,
  status = EXCLUDED.status;


-- ============================================
-- 2. GOALS (5 records)
-- ============================================

INSERT INTO goals (slug, name, description, status)
VALUES
('recovery', 'Recovery', 'Peptides investigated in preclinical research for their potential roles in tissue repair, wound healing, and recovery from musculoskeletal injuries.', 'published'),
('fat-loss', 'Fat Loss', 'Peptides studied for their potential effects on body composition, appetite regulation, and metabolic support in the context of weight management.', 'published'),
('muscle-growth', 'Muscle Growth', 'Peptides researched for potential effects on lean body mass, growth hormone stimulation, and body composition improvements.', 'published'),
('longevity', 'Longevity', 'Peptides under investigation for potential roles in cellular health, tissue maintenance, and age-related physiological changes.', 'published'),
('sleep', 'Sleep', 'Peptides studied for their potential effects on sleep quality, particularly through growth hormone pathway modulation during natural sleep cycles.', 'published')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  status = EXCLUDED.status;


-- ============================================
-- 3. PEPTIDE-GOAL RELATIONSHIPS
-- ============================================

-- BPC-157 goals
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'bpc-157' AND g.slug = 'recovery' ON CONFLICT DO NOTHING;
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'bpc-157' AND g.slug = 'longevity' ON CONFLICT DO NOTHING;

-- TB-500 goals
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'tb-500' AND g.slug = 'recovery' ON CONFLICT DO NOTHING;
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'tb-500' AND g.slug = 'muscle-growth' ON CONFLICT DO NOTHING;

-- Ipamorelin goals
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'ipamorelin' AND g.slug = 'muscle-growth' ON CONFLICT DO NOTHING;
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'ipamorelin' AND g.slug = 'fat-loss' ON CONFLICT DO NOTHING;
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'ipamorelin' AND g.slug = 'sleep' ON CONFLICT DO NOTHING;
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'ipamorelin' AND g.slug = 'longevity' ON CONFLICT DO NOTHING;

-- CJC-1295 goals
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'cjc-1295' AND g.slug = 'muscle-growth' ON CONFLICT DO NOTHING;
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'cjc-1295' AND g.slug = 'fat-loss' ON CONFLICT DO NOTHING;
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'cjc-1295' AND g.slug = 'sleep' ON CONFLICT DO NOTHING;

-- Semaglutide goals
INSERT INTO peptide_goals (peptide_id, goal_id) SELECT p.id, g.id FROM peptides p, goals g WHERE p.slug = 'semaglutide' AND g.slug = 'fat-loss' ON CONFLICT DO NOTHING;


-- ============================================
-- 4. CMS PAGES
-- Delete existing FAQs for clean re-seed
-- ============================================

DELETE FROM faqs WHERE page_id IN (
  SELECT id FROM pages WHERE slug IN (
    'bpc-157', 'tb-500', 'ipamorelin', 'cjc-1295', 'semaglutide',
    'recovery', 'fat-loss', 'muscle-growth', 'longevity', 'sleep',
    'miami', 'new-york', 'los-angeles', 'austin', 'scottsdale',
    'what-are-peptides', 'peptide-therapy-explained',
    'research-peptides-vs-prescription-peptides',
    'peptide-legality-united-states',
    'how-to-evaluate-a-peptide-clinic'
  )
);


-- ============================================
-- 4a. PEPTIDE PAGES (5)
-- ============================================

INSERT INTO pages (slug, page_type, title, meta_description, content, status, last_reviewed_at)
VALUES
(
  'bpc-157', 'peptide',
  'BPC-157 — Research, Mechanisms & Clinic Directory',
  'Learn about BPC-157 peptide research, proposed mechanisms, safety considerations, and find clinics offering BPC-157 therapy.',
  $json${
    "intro": "BPC-157 (Body Protection Compound-157) is one of the most widely discussed peptides in regenerative medicine research. Originally isolated from human gastric juice, this 15-amino-acid peptide has generated significant interest due to preclinical findings across a range of tissue types.",
    "sections": [
      {"heading": "What Is BPC-157?", "body": "BPC-157 is a pentadecapeptide, meaning it consists of 15 amino acids. It is a partial sequence of body protection compound (BPC), a protein that occurs naturally in human gastric juice. Researchers have noted its stability in gastric juice, which is unusual for peptides and has made it a subject of interest in gastrointestinal research."},
      {"heading": "Research Background", "body": "The majority of BPC-157 research has been conducted in animal models. Studies have investigated its effects on tendon healing, muscle injury repair, bone healing, and gastrointestinal protection. While preclinical results have been noted in published literature, it is important to understand that large-scale human clinical trials remain limited. BPC-157 is not currently FDA-approved for any medical condition."},
      {"heading": "Proposed Mechanisms", "body": "Researchers have proposed several potential mechanisms through which BPC-157 may exert its effects. These include modulation of growth factor expression, interactions with the nitric oxide system, and effects on blood vessel formation. However, the exact mechanisms are still under active investigation and not fully established."},
      {"heading": "Safety Considerations", "body": "As with any research compound, safety data for BPC-157 in humans is limited. Most safety observations come from animal studies. Anyone considering peptide therapy should consult with a qualified healthcare provider who can evaluate individual health circumstances and discuss potential risks and benefits."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'tb-500', 'peptide',
  'TB-500 — Research, Background & Clinic Directory',
  'Learn about TB-500 (Thymosin Beta-4), its research background, proposed mechanisms, and find clinics offering TB-500 therapy.',
  $json${
    "intro": "TB-500 is a synthetic peptide based on a naturally occurring protein called thymosin beta-4. It has been studied primarily in preclinical settings for its potential roles in wound healing and tissue repair.",
    "sections": [
      {"heading": "What Is TB-500?", "body": "TB-500 is a synthetic fragment of thymosin beta-4, a 43-amino-acid protein found throughout the human body. Thymosin beta-4 is involved in multiple cellular processes including cell migration, blood vessel formation, and regulation of actin (a key structural protein in cells). TB-500 represents a specific active region of this larger protein."},
      {"heading": "Research Background", "body": "Research on TB-500 and thymosin beta-4 has primarily been conducted in animal models and cell culture studies. Published preclinical studies have explored its potential effects on wound healing, cardiac tissue repair, and inflammation modulation. Human clinical data is limited, and TB-500 is not FDA-approved for any medical use."},
      {"heading": "Proposed Mechanisms", "body": "Thymosin beta-4 is understood to promote cell migration by interacting with actin, supporting the movement of cells to injury sites. Researchers have also studied its potential role in promoting blood vessel development and modulating inflammatory responses. These proposed mechanisms are based primarily on preclinical observations."},
      {"heading": "Safety Considerations", "body": "Safety data for TB-500 in humans is limited to small studies and case reports. As with all research peptides, individuals should work with qualified medical professionals before considering any peptide-based therapy."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'ipamorelin', 'peptide',
  'Ipamorelin — Research, Mechanisms & Clinic Directory',
  'Learn about ipamorelin, a selective growth hormone secretagogue peptide, its research background, and find clinics offering ipamorelin therapy.',
  $json${
    "intro": "Ipamorelin is a growth hormone secretagogue peptide that has drawn research interest due to its selectivity in stimulating growth hormone release. It is one of several peptides in this class, but is noted for its comparatively targeted mechanism.",
    "sections": [
      {"heading": "What Is Ipamorelin?", "body": "Ipamorelin is a pentapeptide (five amino acids) that acts as a selective agonist of the growth hormone secretagogue receptor (GHS-R). It was developed as part of efforts to create more targeted growth hormone-releasing compounds with fewer systemic side effects compared to earlier secretagogues."},
      {"heading": "Research Background", "body": "Ipamorelin has been studied in both preclinical and limited clinical settings. Research has explored its effects on growth hormone release, body composition, and post-surgical recovery. Some clinical trials have evaluated its safety profile, noting that it appears to stimulate growth hormone release without significant effects on cortisol or prolactin."},
      {"heading": "Ipamorelin and CJC-1295", "body": "Ipamorelin is often discussed alongside CJC-1295, another growth hormone-related peptide. Some research protocols and clinical practices have explored the combination of these two peptides, though clinical evidence for combination therapy is still being developed."},
      {"heading": "Safety Considerations", "body": "Ipamorelin has shown a relatively favorable safety profile in available clinical data, but long-term safety studies are limited. As with all peptide therapies, consultation with a qualified healthcare provider is essential before beginning any treatment protocol."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'cjc-1295', 'peptide',
  'CJC-1295 — Research, Mechanisms & Clinic Directory',
  'Learn about CJC-1295, a GHRH analog peptide, its research background, proposed mechanisms, and find clinics offering CJC-1295 therapy.',
  $json${
    "intro": "CJC-1295 is a synthetic growth hormone-releasing hormone (GHRH) analog designed to have a longer half-life than naturally occurring GHRH, potentially allowing for sustained growth hormone elevation.",
    "sections": [
      {"heading": "What Is CJC-1295?", "body": "CJC-1295 is a 29-amino-acid peptide analog of growth hormone-releasing hormone. It was developed using drug affinity complex (DAC) technology to extend its half-life from minutes to days. This modification allows it to maintain elevated growth hormone levels for longer periods compared to native GHRH."},
      {"heading": "Research Background", "body": "Clinical research on CJC-1295 has explored its effects on growth hormone and IGF-1 levels. Studies have demonstrated sustained elevation of these hormones following administration. Research has also investigated potential applications in growth hormone deficiency and body composition. CJC-1295 with DAC is distinct from modified GRF 1-29 (CJC-1295 without DAC)."},
      {"heading": "CJC-1295 and Ipamorelin", "body": "CJC-1295 is frequently studied in combination with ipamorelin. The rationale is that CJC-1295 acts on the GHRH receptor while ipamorelin acts on the ghrelin receptor, potentially providing complementary growth hormone stimulation through different pathways."},
      {"heading": "Safety Considerations", "body": "Available clinical data on CJC-1295 is limited. Side effects reported in studies have included injection site reactions and transient effects. Long-term safety data is not well established. Medical supervision is essential for anyone considering growth hormone secretagogue therapy."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'semaglutide', 'peptide',
  'Semaglutide — FDA-Approved GLP-1 Agonist Guide',
  'Learn about semaglutide (Ozempic, Wegovy), an FDA-approved GLP-1 receptor agonist for diabetes and weight management. Find prescribing clinics.',
  $json${
    "intro": "Semaglutide is one of the most well-known peptide-based medications currently in use. Unlike many peptides discussed in research contexts, semaglutide has received full FDA approval for specific medical conditions and is available only by prescription.",
    "sections": [
      {"heading": "What Is Semaglutide?", "body": "Semaglutide is a glucagon-like peptide-1 (GLP-1) receptor agonist. It mimics the incretin hormone GLP-1, which is naturally released after eating and helps regulate blood sugar and appetite. Semaglutide has been approved by the FDA under multiple brand names for different indications."},
      {"heading": "FDA-Approved Uses", "body": "Semaglutide is FDA-approved for two primary indications. Ozempic (injectable) and Rybelsus (oral) are approved for the treatment of type 2 diabetes. Wegovy (injectable at a higher dose) is approved for chronic weight management in adults with obesity or overweight with at least one weight-related comorbidity."},
      {"heading": "How It Works", "body": "Semaglutide works by binding to GLP-1 receptors, which helps stimulate insulin secretion, reduce glucagon release, slow gastric emptying, and reduce appetite. These combined effects help manage blood sugar levels and can lead to significant weight reduction in clinical trials."},
      {"heading": "Important Safety Information", "body": "Semaglutide is a prescription medication with established safety data from large clinical trials. Common side effects include nausea, vomiting, and diarrhea. It carries a boxed warning regarding thyroid C-cell tumors observed in animal studies. It is contraindicated in patients with a personal or family history of medullary thyroid carcinoma. Always consult your physician for complete prescribing information."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
)
ON CONFLICT (slug, page_type) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  last_reviewed_at = EXCLUDED.last_reviewed_at;


-- ============================================
-- 4b. GOAL PAGES (5)
-- ============================================

INSERT INTO pages (slug, page_type, title, meta_description, content, status, last_reviewed_at)
VALUES
(
  'recovery', 'goal',
  'Peptides for Recovery — Research & Clinic Directory',
  'Explore peptides studied for recovery, tissue repair, and wound healing. Compare research-backed compounds and find peptide therapy clinics.',
  $json${
    "intro": "Recovery from injury, surgery, or intense physical activity is one of the most actively researched areas in peptide science. Several peptides have been studied in preclinical and early clinical settings for their potential roles in tissue repair and healing.",
    "sections": [
      {"heading": "Understanding Recovery Peptides", "body": "Recovery-focused peptides are compounds studied for their potential to support the body during tissue repair processes. Research has explored their effects on tendons, muscles, ligaments, and gastrointestinal tissue. It is important to note that most of this research is preclinical, and no peptides are currently FDA-approved specifically for recovery enhancement."},
      {"heading": "What the Research Shows", "body": "Preclinical studies have investigated peptides like BPC-157 and TB-500 for their effects on healing timelines and tissue quality. These studies, primarily conducted in animal models, have shown promising results, but translating animal research to human outcomes requires further clinical investigation."},
      {"heading": "Working with a Provider", "body": "If you are interested in peptide therapy for recovery, working with a qualified healthcare provider is essential. A provider can evaluate your specific situation, discuss the current state of evidence, and help determine whether peptide therapy might be appropriate for your circumstances."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'fat-loss', 'goal',
  'Peptides for Fat Loss — Research & Clinic Directory',
  'Explore peptides studied for fat loss and body composition, including FDA-approved options. Compare compounds and find peptide therapy clinics.',
  $json${
    "intro": "Peptides related to fat loss and body composition range from FDA-approved medications to research compounds still being studied. Understanding the differences between these categories is important for making informed decisions.",
    "sections": [
      {"heading": "FDA-Approved vs. Research Peptides", "body": "Semaglutide (Wegovy) is currently the most well-known FDA-approved peptide-based medication for weight management. Other peptides such as ipamorelin and CJC-1295 have been studied for body composition effects but do not have FDA approval for weight loss. This distinction is important when evaluating treatment options."},
      {"heading": "How Peptides May Affect Body Composition", "body": "Different peptides interact with distinct biological pathways. GLP-1 agonists like semaglutide affect appetite and glucose metabolism. Growth hormone secretagogues like ipamorelin may influence body composition through growth hormone pathways. The evidence base varies significantly between these compound classes."},
      {"heading": "Working with a Provider", "body": "Weight management is a complex medical topic. Any peptide-based approach should be supervised by a qualified healthcare provider who can assess your overall health, consider contraindications, and monitor progress. Self-administration of research peptides for weight loss is not recommended."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'muscle-growth', 'goal',
  'Peptides for Muscle Growth — Research & Clinic Directory',
  'Explore peptides studied for muscle growth and lean body mass. Compare growth hormone secretagogues and find peptide therapy clinics.',
  $json${
    "intro": "Growth hormone secretagogue peptides have been studied for their potential effects on lean body mass and body composition. Understanding the research landscape helps inform realistic expectations about these compounds.",
    "sections": [
      {"heading": "Growth Hormone and Muscle", "body": "Growth hormone plays a role in protein synthesis, cell reproduction, and body composition regulation. Research peptides like ipamorelin and CJC-1295 are studied for their ability to stimulate growth hormone release, which may indirectly influence lean body mass. However, the relationship between growth hormone elevation and meaningful muscle growth is more nuanced than often presented."},
      {"heading": "What the Research Shows", "body": "Clinical studies on growth hormone secretagogues have shown measurable increases in growth hormone and IGF-1 levels. Some studies have observed modest changes in body composition. However, results vary, and the magnitude of effects on muscle growth specifically is still being established through ongoing research."},
      {"heading": "Working with a Provider", "body": "Peptide therapy for body composition goals should be approached under medical supervision. A qualified provider can assess whether growth hormone secretagogue therapy is appropriate, monitor hormone levels, and ensure safe protocols are followed."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'longevity', 'goal',
  'Peptides for Longevity — Research & Clinic Directory',
  'Explore peptides studied for longevity, cellular health, and age-related changes. Compare research compounds and find peptide therapy clinics.',
  $json${
    "intro": "Longevity-focused peptide research examines compounds that may influence cellular health, tissue maintenance, and the physiological changes associated with aging. This is an emerging area of investigation with significant ongoing research.",
    "sections": [
      {"heading": "Peptides and Aging Research", "body": "Several peptides have been investigated for potential effects on age-related processes. BPC-157 has been studied for tissue protection. Growth hormone secretagogues have been explored for their effects on body composition changes that occur with aging. Thymosin peptides have been researched for immune function. Most of this work remains in early stages."},
      {"heading": "Current State of Evidence", "body": "It is important to approach longevity claims critically. While preclinical research has identified interesting properties for various peptides, translating these findings to meaningful human longevity outcomes requires extensive clinical research. No peptides are currently FDA-approved for anti-aging or longevity purposes."},
      {"heading": "Working with a Provider", "body": "If longevity-oriented peptide therapy interests you, consult with a healthcare provider who specializes in age management or regenerative medicine. They can provide evidence-based guidance and help distinguish between established medical treatments and emerging research."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'sleep', 'goal',
  'Peptides for Sleep — Research & Clinic Directory',
  'Explore peptides studied for sleep quality improvement, particularly through growth hormone pathway modulation. Find peptide therapy clinics.',
  $json${
    "intro": "The relationship between peptides and sleep is primarily studied through the lens of growth hormone physiology, since growth hormone is naturally released in pulses during deep sleep. Some peptides may interact with these pathways.",
    "sections": [
      {"heading": "Growth Hormone and Sleep", "body": "Growth hormone release follows a circadian pattern, with the largest natural pulse occurring during slow-wave (deep) sleep. Growth hormone secretagogues like ipamorelin have been studied for their effects on this natural rhythm. Some clinical observations have noted improvements in sleep quality as a secondary outcome in growth hormone secretagogue studies."},
      {"heading": "What the Research Shows", "body": "While some users of growth hormone secretagogues report subjective improvements in sleep quality, controlled clinical research specifically examining peptides as sleep aids is limited. The observed effects may be related to improved growth hormone pulsatility during sleep, but this mechanism is not fully established."},
      {"heading": "Working with a Provider", "body": "Sleep disorders have many potential causes and should be evaluated by a healthcare professional. While peptide therapy may be discussed as part of a comprehensive approach, it should not replace proper sleep disorder diagnosis and evidence-based treatments."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
)
ON CONFLICT (slug, page_type) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  last_reviewed_at = EXCLUDED.last_reviewed_at;


-- ============================================
-- 4c. CITY PAGES (5)
-- ============================================

INSERT INTO pages (slug, page_type, title, meta_description, content, status, last_reviewed_at)
VALUES
(
  'miami', 'city',
  'Peptide Clinics in Miami — Directory & Guide',
  'Find peptide therapy clinics in Miami, FL. Compare providers, learn about available treatments, and understand what to look for in a Miami peptide clinic.',
  $json${
    "intro": "Miami is one of the leading cities in the United States for peptide therapy and regenerative medicine. The city hosts numerous clinics offering peptide-based treatments, making it important to understand how to evaluate providers and what to expect.",
    "sections": [
      {"heading": "Peptide Therapy in Miami", "body": "Miami has become a hub for regenerative and anti-aging medicine, with many clinics incorporating peptide therapy into their service offerings. The concentration of providers in South Florida gives patients options, but also makes careful evaluation of clinics essential."},
      {"heading": "What to Look for in a Miami Clinic", "body": "When evaluating peptide clinics in Miami, consider the credentials of the prescribing physician, whether the clinic sources peptides from licensed compounding pharmacies, and whether they provide proper medical oversight including lab work and follow-up appointments. Avoid clinics that make unsupported claims about peptide efficacy."},
      {"heading": "Common Treatments Available", "body": "Miami peptide clinics commonly offer growth hormone secretagogue therapy, BPC-157 protocols, and FDA-approved GLP-1 medications like semaglutide. Treatment availability varies by clinic, and all peptide therapies should be administered under proper medical supervision."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'new-york', 'city',
  'Peptide Clinics in New York — Directory & Guide',
  'Find peptide therapy clinics in New York City. Compare providers, learn about treatments, and understand what to look for in a NYC peptide clinic.',
  $json${
    "intro": "New York City is home to a growing number of clinics offering peptide therapy as part of integrative, functional, and regenerative medicine practices. The city provides access to leading medical professionals in this emerging field.",
    "sections": [
      {"heading": "Peptide Therapy in New York", "body": "New York has a robust medical infrastructure that includes clinics specializing in peptide therapy. Many NYC providers integrate peptide treatments with comprehensive health assessments, hormone optimization, and functional medicine approaches."},
      {"heading": "What to Look for in a New York Clinic", "body": "Look for board-certified physicians with experience in peptide prescribing, clinics that require initial consultations and blood work, and providers who source from FDA-registered compounding pharmacies. New York State has specific regulations around compounded medications that reputable clinics will follow."},
      {"heading": "Common Treatments Available", "body": "New York peptide clinics typically offer growth hormone secretagogue protocols, recovery-focused peptides, and FDA-approved weight management medications. Telehealth options are also available from some NYC-based providers for patients across the state."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'los-angeles', 'city',
  'Peptide Clinics in Los Angeles — Directory & Guide',
  'Find peptide therapy clinics in Los Angeles. Compare providers, learn about treatments, and understand what to look for in an LA peptide clinic.',
  $json${
    "intro": "Los Angeles has a well-established integrative and functional medicine community, with many clinics now offering peptide therapy alongside other advanced treatment modalities.",
    "sections": [
      {"heading": "Peptide Therapy in Los Angeles", "body": "LA has long been at the forefront of wellness and anti-aging medicine. Many clinics in the greater Los Angeles area have added peptide therapy to their offerings, providing patients with access to both research peptides prescribed off-label and FDA-approved peptide medications."},
      {"heading": "What to Look for in an LA Clinic", "body": "Evaluate LA clinics based on physician qualifications, pharmacy sourcing practices, and whether they provide comprehensive medical oversight. California has specific regulations for compounded medications, and reputable clinics will operate within these guidelines."},
      {"heading": "Common Treatments Available", "body": "Los Angeles peptide clinics frequently offer growth hormone secretagogues, tissue repair peptides, and GLP-1 receptor agonists for weight management. Many also offer combination protocols tailored to individual patient goals."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'austin', 'city',
  'Peptide Clinics in Austin — Directory & Guide',
  'Find peptide therapy clinics in Austin, TX. Compare providers, learn about treatments, and understand what to look for in an Austin peptide clinic.',
  $json${
    "intro": "Austin has emerged as a center for functional and integrative medicine in Texas, with a growing number of clinics offering peptide therapy as part of their treatment options.",
    "sections": [
      {"heading": "Peptide Therapy in Austin", "body": "The Austin health and wellness scene has expanded to include clinics specializing in peptide therapy. Many Austin providers combine peptide treatments with functional medicine, hormone optimization, and lifestyle medicine approaches."},
      {"heading": "What to Look for in an Austin Clinic", "body": "When selecting a peptide clinic in Austin, verify the prescribing provider holds appropriate medical licenses, the clinic uses legitimate compounding pharmacy sources, and initial treatment includes proper medical evaluation. Texas medical board guidelines apply to peptide prescribing practices."},
      {"heading": "Common Treatments Available", "body": "Austin peptide clinics commonly offer growth hormone secretagogue therapy, recovery and tissue repair peptides, and FDA-approved weight management medications. Availability varies by provider, and all treatments should include proper medical supervision."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'scottsdale', 'city',
  'Peptide Clinics in Scottsdale — Directory & Guide',
  'Find peptide therapy clinics in Scottsdale, AZ. Compare providers, learn about treatments, and understand what to look for in a Scottsdale peptide clinic.',
  $json${
    "intro": "Scottsdale has become a well-known destination for regenerative medicine and wellness treatments, with numerous clinics offering peptide therapy as part of their service offerings.",
    "sections": [
      {"heading": "Peptide Therapy in Scottsdale", "body": "Scottsdale and the greater Phoenix area host a significant number of clinics specializing in peptide therapy and regenerative medicine. The concentration of providers reflects the area strong wellness and anti-aging medical community."},
      {"heading": "What to Look for in a Scottsdale Clinic", "body": "Evaluate Scottsdale peptide clinics based on physician credentials, whether they conduct comprehensive health assessments before prescribing, and their pharmacy sourcing practices. Arizona regulations for compounded medications should be followed by all legitimate providers."},
      {"heading": "Common Treatments Available", "body": "Scottsdale clinics frequently offer a full range of peptide treatments including growth hormone secretagogues, tissue repair peptides, immune-supporting peptides, and FDA-approved GLP-1 medications for weight management."}
    ]
  }$json$::jsonb,
  'published',
  NOW()
)
ON CONFLICT (slug, page_type) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  last_reviewed_at = EXCLUDED.last_reviewed_at;


-- ============================================
-- 4d. LEARN PAGES (4)
-- ============================================

INSERT INTO pages (slug, page_type, title, meta_description, content, status, last_reviewed_at)
VALUES
(
  'what-are-peptides', 'learn',
  'What Are Peptides? A Beginner''s Guide',
  'Learn what peptides are, how they work in the body, and why they are gaining attention in medical research and clinical practice.',
  $json${
    "intro": "Peptides are short chains of amino acids that play diverse roles in human biology. Understanding what peptides are and how they function is the first step toward evaluating the growing field of peptide therapy.",
    "sections": [
      {"heading": "Peptides Defined", "body": "Peptides are molecules made up of two or more amino acids linked by peptide bonds. They are distinguished from proteins primarily by size. Peptides typically contain fewer than 50 amino acids, while proteins are larger. The human body naturally produces many peptides that serve as hormones, signaling molecules, and structural components."},
      {"heading": "How Peptides Work", "body": "Peptides function by binding to specific receptors on cell surfaces, triggering biological responses. Different peptides target different receptors and pathways. For example, GLP-1 peptides bind to GLP-1 receptors involved in blood sugar regulation, while growth hormone secretagogues bind to ghrelin receptors to stimulate growth hormone release."},
      {"heading": "Natural vs. Synthetic Peptides", "body": "The body produces peptides naturally as part of normal physiology. Synthetic peptides are manufactured versions designed to mimic or enhance specific biological functions. Some synthetic peptides, like semaglutide, have undergone extensive clinical testing and received FDA approval. Others remain in various stages of research."},
      {"heading": "The Current Landscape", "body": "Peptide therapy is an evolving field. Some peptides have decades of clinical research behind them, while others are primarily supported by preclinical data. Understanding where specific peptides fall on this spectrum is important for making informed decisions about potential therapy."}
    ],
    "related_peptides": ["bpc-157", "tb-500", "ipamorelin", "cjc-1295", "semaglutide"],
    "related_goals": ["recovery", "fat-loss", "muscle-growth"]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'peptide-therapy-explained', 'learn',
  'Peptide Therapy Explained — How It Works',
  'Understand how peptide therapy works, what to expect from treatment, and how to evaluate whether peptide therapy may be appropriate for you.',
  $json${
    "intro": "Peptide therapy refers to the medical use of specific peptide compounds to address health goals. This guide explains how peptide therapy typically works, what the treatment process involves, and important considerations for prospective patients.",
    "sections": [
      {"heading": "How Peptide Therapy Works", "body": "Peptide therapy involves administering specific peptide compounds to interact with targeted biological pathways. Most peptides are administered via subcutaneous injection, though some are available in oral, nasal, or topical forms. The specific peptide, dosage, and administration route depend on the treatment goal and the prescribing provider protocol."},
      {"heading": "The Treatment Process", "body": "A typical peptide therapy process begins with a medical consultation and comprehensive lab work. The provider evaluates health status, discusses goals, and determines whether peptide therapy is appropriate. If prescribed, the provider establishes a protocol including dosing, frequency, and duration. Ongoing monitoring through follow-up labs and appointments is standard practice."},
      {"heading": "FDA-Approved vs. Off-Label Use", "body": "Some peptides like semaglutide have FDA approval for specific conditions. Other peptides may be prescribed off-label by physicians using compounded formulations. Understanding this distinction is important. FDA-approved peptides have extensive safety and efficacy data, while off-label use relies on emerging research and clinical judgment."},
      {"heading": "Finding a Qualified Provider", "body": "Look for providers who are licensed physicians with training in peptide therapy, require comprehensive initial evaluations, use FDA-registered compounding pharmacies, and provide ongoing medical supervision. Be cautious of providers who skip evaluations, make guarantees, or operate without proper medical oversight."}
    ],
    "related_peptides": ["ipamorelin", "cjc-1295", "semaglutide"],
    "related_goals": ["recovery", "fat-loss", "muscle-growth", "longevity", "sleep"]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'research-peptides-vs-prescription-peptides', 'learn',
  'Research Peptides vs. Prescription Peptides — Key Differences',
  'Understand the critical differences between research peptides and prescription peptides, including safety, legality, and quality considerations.',
  $json${
    "intro": "The peptide landscape includes both FDA-approved prescription medications and research-grade compounds. Understanding the differences between these categories is essential for safety and informed decision-making.",
    "sections": [
      {"heading": "Prescription Peptides", "body": "Prescription peptides are medications that have undergone rigorous clinical trials, received FDA approval for specific indications, and are manufactured under strict pharmaceutical standards. Examples include semaglutide (Ozempic, Wegovy) and other GLP-1 receptor agonists. These medications have extensive safety data and are obtained through licensed pharmacies with a valid prescription."},
      {"heading": "Research Peptides", "body": "Research peptides are compounds available through compounding pharmacies or research chemical suppliers. Many have preclinical research supporting their potential effects but have not completed the FDA approval process. When prescribed by a physician through a licensed compounding pharmacy, these peptides fall under the practice of medicine. However, quality and purity can vary significantly between sources."},
      {"heading": "Quality and Safety Considerations", "body": "The quality of peptide products varies dramatically depending on the source. FDA-approved medications meet stringent manufacturing standards. Compounded peptides from FDA-registered pharmacies follow specific guidelines but have less regulatory oversight than manufactured drugs. Peptides from unregulated sources carry significant risks including impurities, incorrect dosing, and contamination."},
      {"heading": "Making Informed Decisions", "body": "Always work with a licensed healthcare provider when considering peptide therapy. Ensure any compounded peptides come from an FDA-registered compounding pharmacy. Be skeptical of peptides sold online without a prescription, as these may not meet quality or safety standards. The distinction between legitimate medical use and unregulated supplement sales is critical."}
    ],
    "related_peptides": ["semaglutide", "bpc-157", "ipamorelin"],
    "related_goals": ["recovery", "fat-loss"]
  }$json$::jsonb,
  'published',
  NOW()
),
(
  'how-to-evaluate-a-peptide-clinic', 'learn',
  'How to Evaluate a Peptide Clinic — A Patient''s Checklist',
  'Learn how to evaluate peptide therapy clinics. Understand what credentials to look for, red flags to avoid, and questions to ask before starting treatment.',
  $json${
    "intro": "Choosing the right peptide clinic is one of the most important decisions you can make for your safety and treatment outcomes. This guide provides a practical framework for evaluating clinics and providers.",
    "sections": [
      {"heading": "Provider Credentials", "body": "The prescribing provider should be a licensed physician (MD or DO) with relevant training or certification in peptide therapy, functional medicine, or regenerative medicine. Verify their medical license through your state medical board. Ask about their specific experience with the peptides being recommended."},
      {"heading": "Medical Evaluation Process", "body": "A reputable clinic will require a comprehensive initial consultation that includes a detailed health history, relevant laboratory tests, and a discussion of your health goals. Be wary of clinics that prescribe peptides without a proper medical evaluation or that rely solely on brief questionnaires."},
      {"heading": "Pharmacy Sourcing", "body": "Ask where the clinic sources its peptides. Legitimate providers use FDA-registered compounding pharmacies that follow Current Good Manufacturing Practice (cGMP) guidelines. The pharmacy should provide certificates of analysis for their products. Avoid clinics that source from overseas suppliers or cannot provide documentation about their peptide sources."},
      {"heading": "Red Flags to Watch For", "body": "Be cautious of clinics that guarantee results, prescribe without proper evaluation, use pressure tactics, make claims not supported by research, sell peptides directly without a prescription process, or lack proper medical licensing. These are signs of practices that may not prioritize patient safety."},
      {"heading": "Questions to Ask", "body": "Before starting treatment, ask your provider about the evidence supporting the recommended peptide, potential side effects and risks, what monitoring will be done during treatment, the source and quality of the peptides being used, and what outcomes are realistic based on current research."}
    ],
    "related_peptides": ["bpc-157", "ipamorelin", "semaglutide"],
    "related_goals": ["recovery", "fat-loss", "muscle-growth"]
  }$json$::jsonb,
  'published',
  NOW()
)
ON CONFLICT (slug, page_type) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  last_reviewed_at = EXCLUDED.last_reviewed_at;


-- ============================================
-- 4e. LEGAL PAGE (1)
-- ============================================

INSERT INTO pages (slug, page_type, title, meta_description, content, status, last_reviewed_at)
VALUES
(
  'peptide-legality-united-states', 'legal',
  'Peptide Legality in the United States — What You Need to Know',
  'Understand the legal status of peptides in the United States, including FDA regulations, compounding pharmacy rules, and state-level considerations.',
  $json${
    "intro": "The legal landscape for peptides in the United States is complex and varies by compound, intended use, and source. Understanding these regulations is important for anyone considering peptide therapy.",
    "sections": [
      {"heading": "FDA-Approved Peptides", "body": "Some peptides have received full FDA approval for specific medical indications. Semaglutide, for example, is FDA-approved for type 2 diabetes and weight management. These peptides are manufactured by pharmaceutical companies under strict regulatory oversight and are available through licensed pharmacies with a valid prescription."},
      {"heading": "Compounded Peptides", "body": "Many peptides used in clinical practice are prepared by compounding pharmacies under the Federal Food, Drug, and Cosmetic Act. Section 503A governs patient-specific compounding by state-licensed pharmacies, while Section 503B covers outsourcing facilities. Compounded peptides require a valid prescription from a licensed provider and are not FDA-approved products."},
      {"heading": "Research Use Only Peptides", "body": "Some peptides are sold labeled as being for research use only. These products are not intended for human consumption and are not subject to pharmaceutical manufacturing standards. Using research-labeled peptides for personal use exists in a legal gray area and carries significant quality and safety risks."},
      {"heading": "Recent Regulatory Changes", "body": "The regulatory environment for peptides continues to evolve. The FDA has taken action regarding certain compounded peptides, and state boards of pharmacy may have additional regulations. Staying informed about current regulations is important. Consult with a licensed healthcare provider for the most current guidance on specific peptides."},
      {"heading": "State-Level Considerations", "body": "Individual states may have additional regulations governing peptide prescribing and compounding. Some states have stricter rules about which peptides can be compounded or prescribed. The legal status of specific peptides can differ depending on your state of residence, making local legal awareness important."}
    ],
    "related_peptides": ["semaglutide", "bpc-157", "ipamorelin", "cjc-1295", "tb-500"],
    "related_goals": ["recovery", "fat-loss"]
  }$json$::jsonb,
  'published',
  NOW()
)
ON CONFLICT (slug, page_type) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  content = EXCLUDED.content,
  status = EXCLUDED.status,
  last_reviewed_at = EXCLUDED.last_reviewed_at;


-- ============================================
-- 5. FAQs FOR ALL PAGES
-- ============================================

-- BPC-157 FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'What is BPC-157 used for in research?', 'BPC-157 has been studied in preclinical research primarily for tissue repair, gastrointestinal protection, and wound healing. It is not FDA-approved for any medical condition.', 0
FROM pages WHERE slug = 'bpc-157' AND page_type = 'peptide';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Is BPC-157 FDA-approved?', 'No. BPC-157 is not FDA-approved for any medical indication. It is available through some compounding pharmacies when prescribed by a licensed physician.', 1
FROM pages WHERE slug = 'bpc-157' AND page_type = 'peptide';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'How is BPC-157 typically administered?', 'In clinical settings where it is prescribed, BPC-157 is most commonly administered via subcutaneous injection. Some providers also use oral formulations. Administration should always be under medical supervision.', 2
FROM pages WHERE slug = 'bpc-157' AND page_type = 'peptide';

-- TB-500 FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'What is TB-500?', 'TB-500 is a synthetic peptide based on thymosin beta-4, a naturally occurring protein involved in cell migration and tissue repair. It has been studied primarily in preclinical research.', 0
FROM pages WHERE slug = 'tb-500' AND page_type = 'peptide';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Is TB-500 the same as thymosin beta-4?', 'TB-500 is a synthetic fragment of thymosin beta-4, not the full protein. It represents a specific active region but is not identical to the complete naturally occurring protein.', 1
FROM pages WHERE slug = 'tb-500' AND page_type = 'peptide';

-- Ipamorelin FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'What does ipamorelin do?', 'Ipamorelin is a growth hormone secretagogue that stimulates the pituitary gland to release growth hormone. It is studied for its selectivity, meaning it targets growth hormone release without significantly affecting other hormones.', 0
FROM pages WHERE slug = 'ipamorelin' AND page_type = 'peptide';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Is ipamorelin FDA-approved?', 'No. Ipamorelin is not FDA-approved. It may be available through licensed compounding pharmacies when prescribed by a physician.', 1
FROM pages WHERE slug = 'ipamorelin' AND page_type = 'peptide';

-- CJC-1295 FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'What is the difference between CJC-1295 with and without DAC?', 'CJC-1295 with DAC (Drug Affinity Complex) has an extended half-life of days, while CJC-1295 without DAC (also called Modified GRF 1-29) has a shorter half-life of about 30 minutes. They have different dosing protocols as a result.', 0
FROM pages WHERE slug = 'cjc-1295' AND page_type = 'peptide';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Can CJC-1295 be combined with ipamorelin?', 'Some clinical protocols combine CJC-1295 with ipamorelin based on the rationale that they work through different receptor pathways. However, combination protocols should only be used under medical supervision.', 1
FROM pages WHERE slug = 'cjc-1295' AND page_type = 'peptide';

-- Semaglutide FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Is semaglutide a peptide?', 'Yes. Semaglutide is a peptide-based medication that mimics the GLP-1 hormone. It is one of the few peptides that has received full FDA approval for specific medical conditions.', 0
FROM pages WHERE slug = 'semaglutide' AND page_type = 'peptide';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'What is the difference between Ozempic and Wegovy?', 'Ozempic and Wegovy both contain semaglutide but are approved for different indications. Ozempic is approved for type 2 diabetes, while Wegovy is approved for chronic weight management. They also differ in dosing.', 1
FROM pages WHERE slug = 'semaglutide' AND page_type = 'peptide';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Do you need a prescription for semaglutide?', 'Yes. Semaglutide is a prescription medication that requires evaluation by a licensed healthcare provider. It is not available over the counter.', 2
FROM pages WHERE slug = 'semaglutide' AND page_type = 'peptide';

-- Recovery FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Which peptides are most studied for recovery?', 'BPC-157 and TB-500 are among the most frequently discussed peptides in preclinical recovery research. However, neither has received FDA approval for recovery or healing indications.', 0
FROM pages WHERE slug = 'recovery' AND page_type = 'goal';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Can peptides speed up injury recovery?', 'Some preclinical research suggests certain peptides may influence healing processes, but human clinical evidence is limited. Always consult a healthcare provider for injury treatment.', 1
FROM pages WHERE slug = 'recovery' AND page_type = 'goal';

-- Fat Loss FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'What is the most effective peptide for weight loss?', 'Semaglutide (Wegovy) is the only peptide with FDA approval for weight management. Clinical trials demonstrated significant weight loss compared to placebo. Other peptides studied for body composition do not have FDA approval for weight loss.', 0
FROM pages WHERE slug = 'fat-loss' AND page_type = 'goal';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Are peptides safe for weight loss?', 'FDA-approved peptides like semaglutide have established safety profiles from clinical trials. Research peptides used off-label have less safety data. All weight management approaches should be supervised by a healthcare provider.', 1
FROM pages WHERE slug = 'fat-loss' AND page_type = 'goal';

-- Muscle Growth FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Can peptides build muscle?', 'Growth hormone secretagogues may influence body composition through growth hormone pathways, but the direct effect on muscle growth is more modest than often claimed. Evidence is still being developed through clinical research.', 0
FROM pages WHERE slug = 'muscle-growth' AND page_type = 'goal';

-- Longevity FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Are there anti-aging peptides?', 'No peptides are FDA-approved for anti-aging. Some peptides are being researched for effects on age-related processes, but clinical evidence for longevity benefits in humans is preliminary.', 0
FROM pages WHERE slug = 'longevity' AND page_type = 'goal';

-- Sleep FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Can peptides improve sleep?', 'Some growth hormone secretagogues may influence sleep quality as a secondary effect of optimizing growth hormone release patterns. However, peptides should not be considered a primary treatment for sleep disorders.', 0
FROM pages WHERE slug = 'sleep' AND page_type = 'goal';

-- City page FAQs (Miami example - representative for all cities)
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'How do I find a reputable peptide clinic in Miami?', 'Look for clinics with board-certified physicians, proper medical evaluation processes, and transparent pharmacy sourcing. Check provider credentials through the Florida medical board.', 0
FROM pages WHERE slug = 'miami' AND page_type = 'city';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Do Miami peptide clinics accept insurance?', 'Coverage varies. FDA-approved peptide medications may be covered by insurance for approved indications. Compounded peptides and off-label uses are typically not covered. Contact your insurance provider for specifics.', 1
FROM pages WHERE slug = 'miami' AND page_type = 'city';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'How do I find a reputable peptide clinic in New York?', 'Look for clinics with board-certified physicians, proper medical evaluation requirements, and sourcing from FDA-registered compounding pharmacies. Verify credentials through the New York State medical board.', 0
FROM pages WHERE slug = 'new-york' AND page_type = 'city';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'How do I find a reputable peptide clinic in Los Angeles?', 'Look for clinics with board-certified physicians, comprehensive initial evaluations, and transparent pharmacy sourcing. Verify credentials through the Medical Board of California.', 0
FROM pages WHERE slug = 'los-angeles' AND page_type = 'city';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'How do I find a reputable peptide clinic in Austin?', 'Look for clinics with board-certified physicians, proper medical evaluation processes, and pharmacy sourcing from FDA-registered facilities. Verify credentials through the Texas Medical Board.', 0
FROM pages WHERE slug = 'austin' AND page_type = 'city';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'How do I find a reputable peptide clinic in Scottsdale?', 'Look for clinics with board-certified physicians, proper medical evaluation processes, and FDA-registered pharmacy sourcing. Verify credentials through the Arizona Medical Board.', 0
FROM pages WHERE slug = 'scottsdale' AND page_type = 'city';

-- Learn page FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Are peptides the same as steroids?', 'No. Peptides are short chains of amino acids, while anabolic steroids are synthetic derivatives of testosterone. They work through entirely different biological mechanisms and have different risk profiles.', 0
FROM pages WHERE slug = 'what-are-peptides' AND page_type = 'learn';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Are all peptides safe?', 'Safety varies widely between peptides. FDA-approved peptides have extensive safety data. Research peptides have limited human safety data. The safety of any peptide also depends on proper dosing, administration, and individual health factors.', 1
FROM pages WHERE slug = 'what-are-peptides' AND page_type = 'learn';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'How long does peptide therapy take to work?', 'Timelines vary by peptide and treatment goal. Some patients notice effects within weeks, while others may require months. FDA-approved medications like semaglutide have established timelines from clinical trial data. Research peptides have less standardized expectations.', 0
FROM pages WHERE slug = 'peptide-therapy-explained' AND page_type = 'learn';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Can I buy peptides online without a prescription?', 'Some peptides are sold online labeled for research use only, but purchasing peptides for personal use without a prescription is not recommended. Legitimate peptide therapy requires a prescription from a licensed provider and sourcing from a registered pharmacy.', 0
FROM pages WHERE slug = 'research-peptides-vs-prescription-peptides' AND page_type = 'learn';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'What should I ask during my first peptide clinic consultation?', 'Ask about the provider credentials, the evidence for recommended treatments, potential side effects, how progress will be monitored, where peptides are sourced, and what the expected timeline and cost will be.', 0
FROM pages WHERE slug = 'how-to-evaluate-a-peptide-clinic' AND page_type = 'learn';

-- Legal page FAQs
INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Are peptides legal in the United States?', 'The legality depends on the specific peptide and how it is obtained. FDA-approved peptides are legal with a prescription. Compounded peptides prescribed by licensed physicians are generally legal. Peptides sold as research chemicals exist in a regulatory gray area.', 0
FROM pages WHERE slug = 'peptide-legality-united-states' AND page_type = 'legal';

INSERT INTO faqs (page_id, question, answer, sort_order)
SELECT id, 'Can my doctor legally prescribe research peptides?', 'Licensed physicians can prescribe compounded medications, including certain peptides, as part of their medical practice. However, the peptides must be obtained from a licensed compounding pharmacy, and the prescribing must be within the scope of a legitimate provider-patient relationship.', 1
FROM pages WHERE slug = 'peptide-legality-united-states' AND page_type = 'legal';


COMMIT;
