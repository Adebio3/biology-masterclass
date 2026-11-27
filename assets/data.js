/* ============================================================
   BIOLOGY MASTERCLASS: ALL LINKS LIVE IN THIS ONE FILE
   ------------------------------------------------------------
   To add a resource, edit the chapter's entry below and save.
   - interactive: path to the chapter's interactive HTML file
   - videos:      [{ title: 'Mitosis', url: 'https://youtu.be/XXXX' }]
   - coursebook:  [{ title: 'Chapter 1 notes', url: '...' }]
   - practice:    our own topic questions page (Paper 1 + Paper 2 + mark schemes)
   - official:    [{ title: '9700/12 May/June 2023 Q3', url: '...' }]
                  (link to papers on the Cambridge School Support Hub;
                   do not upload Cambridge PDFs here: they are copyrighted)
   status: 'ready' | 'building' | 'soon'
   ============================================================ */
window.SITE = {
  brand: 'Biology Masterclass',
  by: 'Prohabs',
  youtube: 'https://www.youtube.com/@prohabs428',
  supportHub: 'https://schoolsupporthub.cambridgeinternational.org/',
  courses: {
    alevel: {
      title: 'Cambridge International AS & A Level Biology',
      code: '9700',
      blurb: 'Interactive lessons, animated videos, coursebook notes and topic-based exam practice for every chapter of the 9700 syllabus.',
      chapters: [
        { n: 1, level: 'AS', title: 'Cell structure', status: 'ready', colour: '#15803d',
          interactive: '../interactives/Cell_Structure_Interactive.html',
          summary: 'Microscopes, magnification and resolution, measuring cells, eukaryotic organelles, prokaryotes and viruses.',
          outcomes: [
            'Make temporary preparations of cells and draw them from a light microscope',
            'Calculate magnification and actual size using mm, µm and nm, and scale bars',
            'Calibrate an eyepiece graticule with a stage micrometer and measure cells',
            'Distinguish between magnification and resolution; compare light and electron microscopes',
            'Recognise organelles in diagrams and electron micrographs and describe their structure and functions',
            'Outline the role of ATP as the universal energy currency, made in mitochondria and chloroplasts',
            'Describe the structure of a prokaryotic cell and compare it with eukaryotic cells',
            'State that viruses are non-cellular, with nucleic acid in a protein capsid and sometimes an envelope',
          ],
          videos: [{ title: 'Making and exporting a protein: the secretory pathway', url: 'https://youtu.be/71uzirI-uTQ' }], coursebook: [{ title: 'Chapter 1 Cell structure: coursebook chapter (PDF, 30 pages)', url: 'coursebook/chapter-01-cell-structure.pdf' }], practice: 'practice/chapter-01.html', official: [] },
        { n: 2, level: 'AS', title: 'Biological molecules', status: 'ready', colour: '#b45309', interactive: '../interactives/Biological_Molecules_Interactive.html', summary: 'Food tests, carbohydrates, lipids, proteins and water.', videos: [], coursebook: [], practice: 'practice/chapter-02.html', official: [] },
        { n: 3, level: 'AS', title: 'Enzymes', status: 'ready', colour: '#0f766e', interactive: '../interactives/Enzymes_Interactive.html', summary: 'Mode of action, measuring rates, factors, Vmax and Km, inhibitors and immobilised enzymes.', videos: [], coursebook: [], practice: 'practice/chapter-03.html', official: [] },
        { n: 4, level: 'AS', title: 'Cell membranes and transport', status: 'ready', colour: '#7c3aed', interactive: '../interactives/Cell_Membranes_Interactive.html', summary: 'Fluid mosaic model, cell signalling, diffusion, osmosis, active transport and bulk transport.', videos: [], coursebook: [], practice: 'practice/chapter-04.html', official: [] },
        { n: 5, level: 'AS', title: 'The mitotic cell cycle', status: 'ready', colour: '#be185d', interactive: '../interactives/Mitotic_Cell_Cycle_Interactive.html', summary: 'Chromosome structure, the cell cycle, mitosis, telomeres, stem cells and cancer.', videos: [], coursebook: [], practice: 'practice/chapter-05.html', official: [] },
        { n: 6, level: 'AS', title: 'Nucleic acids and protein synthesis', status: 'ready', colour: '#1d4ed8', interactive: '../interactives/Nucleic_Acids_Interactive.html', summary: 'DNA and RNA structure, replication, transcription, translation and gene mutations.', videos: [], coursebook: [], practice: 'practice/chapter-06.html', official: [] },
        { n: 7, level: 'AS', title: 'Transport in plants', status: 'ready', colour: '#16a34a', interactive: '../interactives/Transport_in_Plants_Interactive.html', summary: 'Xylem and phloem, transpiration, water and mass flow.', videos: [], coursebook: [], practice: 'practice/chapter-07.html', official: [] },
        { n: 8, level: 'AS', title: 'Transport in mammals', status: 'ready', colour: '#dc2626', interactive: '../interactives/Transport_in_Mammals_Interactive.html', summary: 'Blood vessels, blood, haemoglobin and the heart.', videos: [], coursebook: [], practice: 'practice/chapter-08.html', official: [] },
        { n: 9, level: 'AS', title: 'Gas exchange', status: 'ready', colour: '#0284c7', interactive: '../interactives/Gas_Exchange_Interactive.html', summary: 'The gas exchange system, its tissues and the alveoli.', videos: [], coursebook: [], practice: 'practice/chapter-09.html', official: [] },
        { n: 10, level: 'AS', title: 'Infectious diseases', status: 'ready', colour: '#ea580c', interactive: '../interactives/Infectious_Diseases_Interactive.html', summary: 'Cholera, malaria, TB, HIV/AIDS, antibiotics and resistance.', videos: [], coursebook: [], practice: 'practice/chapter-10.html', official: [] },
        { n: 11, level: 'AS', title: 'Immunity', status: 'ready', colour: '#1e40af', interactive: '../interactives/Immunity_Interactive.html', summary: 'Phagocytes, lymphocytes, antibodies, monoclonal antibodies and vaccination.', videos: [], coursebook: [], practice: 'practice/chapter-11.html', official: [] },
        { n: 12, level: 'A Level', title: 'Energy and respiration', status: 'ready', colour: '#c2410c', interactive: '../interactives/Energy_Respiration_Interactive.html', summary: 'ATP, glycolysis, link reaction, Krebs cycle, oxidative phosphorylation, anaerobic respiration, RQ and respirometers.', videos: [], coursebook: [], practice: 'practice/chapter-12.html', official: [] },
        { n: 13, level: 'A Level', title: 'Photosynthesis', status: 'ready', colour: '#15803d', interactive: '../interactives/Photosynthesis_Interactive.html', summary: 'Chloroplasts, pigments and chromatography, light-dependent stage, Calvin cycle and limiting factors.', videos: [], coursebook: [], practice: 'practice/chapter-13.html', official: [] },
        { n: 14, level: 'A Level', title: 'Homeostasis', status: 'ready', colour: '#be123c', interactive: '../interactives/Homeostasis_Interactive.html', summary: 'Negative feedback, the kidney, ADH, insulin and glucagon, cell signalling, test strips and stomata.', videos: [], coursebook: [], practice: 'practice/chapter-14.html', official: [] },
        { n: 15, level: 'A Level', title: 'Control and coordination', status: 'ready', colour: '#0e7490', interactive: '../interactives/Control_Coordination_Interactive.html', summary: 'Neurones, action potentials, synapses, muscle contraction, and control in plants.', videos: [], coursebook: [], practice: 'practice/chapter-15.html', official: [] },
        { n: 16, level: 'A Level', title: 'Inheritance', status: 'ready', colour: '#6d28d9', interactive: '../interactives/Inheritance_Interactive.html', summary: 'Meiosis, monohybrid and dihybrid crosses, linkage, epistasis, chi-squared and gene control.', videos: [], coursebook: [], practice: 'practice/chapter-16.html', official: [] },
        { n: 17, level: 'A Level', title: 'Selection and evolution', status: 'ready', colour: '#047857', interactive: '../interactives/Selection_Evolution_Interactive.html', summary: 'Variation, t-test, natural selection, genetic drift, Hardy–Weinberg, selective breeding and speciation.', videos: [], coursebook: [], practice: 'practice/chapter-17.html', official: [] },
        { n: 18, level: 'A Level', title: 'Classification, biodiversity and conservation', status: 'ready', colour: '#0369a1', interactive: '../interactives/Biodiversity_Conservation_Interactive.html', summary: 'Species, domains, sampling methods, correlation, Simpson’s index and conservation.', videos: [], coursebook: [], practice: 'practice/chapter-18.html', official: [] },
        { n: 19, level: 'A Level', title: 'Genetic technology', status: 'ready', colour: '#be185d', interactive: '../interactives/Genetic_Technology_Interactive.html', summary: 'Recombinant DNA, PCR, electrophoresis, microarrays, medicine and GM organisms.', videos: [], coursebook: [], practice: 'practice/chapter-19.html', official: [] },
      ],
    },
    igcse: {
      title: 'Cambridge IGCSE Biology',
      code: '0610',
      blurb: 'Coming soon: the same interactive lessons, videos and topic practice for every IGCSE topic.',
      chapters: [
        'Characteristics and classification of living organisms', 'Organisation of the organism', 'Movement into and out of cells', 'Biological molecules', 'Enzymes', 'Plant nutrition', 'Human nutrition', 'Transport in plants', 'Transport in animals', 'Diseases and immunity', 'Gas exchange in humans', 'Respiration', 'Excretion in humans', 'Coordination and response', 'Drugs', 'Reproduction', 'Inheritance', 'Variation and selection', 'Organisms and their environment', 'Human influences on ecosystems', 'Biotechnology and genetic modification',
      ].map((title, i) => ({ n: i + 1, level: 'IGCSE', title, status: 'soon', colour: '#64748b' })),
    },
  },
};
