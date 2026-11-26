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
          videos: [], coursebook: [], practice: 'practice/chapter-01.html', official: [] },
        { n: 2, level: 'AS', title: 'Biological molecules', status: 'ready', colour: '#b45309', interactive: '../interactives/Biological_Molecules_Interactive.html', summary: 'Food tests, carbohydrates, lipids, proteins and water.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 3, level: 'AS', title: 'Enzymes', status: 'ready', colour: '#0f766e', interactive: '../interactives/Enzymes_Interactive.html', summary: 'Mode of action, measuring rates, factors, Vmax and Km, inhibitors and immobilised enzymes.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 4, level: 'AS', title: 'Cell membranes and transport', status: 'ready', colour: '#7c3aed', interactive: '../interactives/Cell_Membranes_Interactive.html', summary: 'Fluid mosaic model, cell signalling, diffusion, osmosis, active transport and bulk transport.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 5, level: 'AS', title: 'The mitotic cell cycle', status: 'ready', colour: '#be185d', interactive: '../interactives/Mitotic_Cell_Cycle_Interactive.html', summary: 'Chromosome structure, the cell cycle, mitosis, telomeres, stem cells and cancer.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 6, level: 'AS', title: 'Nucleic acids and protein synthesis', status: 'ready', colour: '#1d4ed8', interactive: '../interactives/Nucleic_Acids_Interactive.html', summary: 'DNA and RNA structure, replication, transcription, translation and gene mutations.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 7, level: 'AS', title: 'Transport in plants', status: 'ready', colour: '#16a34a', interactive: '../interactives/Transport_in_Plants_Interactive.html', summary: 'Xylem and phloem, transpiration, water and mass flow.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 8, level: 'AS', title: 'Transport in mammals', status: 'ready', colour: '#dc2626', interactive: '../interactives/Transport_in_Mammals_Interactive.html', summary: 'Blood vessels, blood, haemoglobin and the heart.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 9, level: 'AS', title: 'Gas exchange', status: 'ready', colour: '#0284c7', interactive: '../interactives/Gas_Exchange_Interactive.html', summary: 'The gas exchange system, its tissues and the alveoli.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 10, level: 'AS', title: 'Infectious diseases', status: 'ready', colour: '#ea580c', interactive: '../interactives/Infectious_Diseases_Interactive.html', summary: 'Cholera, malaria, TB, HIV/AIDS, measles, antibiotics and resistance.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 11, level: 'AS', title: 'Immunity', status: 'ready', colour: '#1e40af', interactive: '../interactives/Immunity_Interactive.html', summary: 'Phagocytes, lymphocytes, antibodies, monoclonal antibodies and vaccination.', videos: [], coursebook: [], practice: '', official: [] },
        { n: 12, level: 'A Level', title: 'Energy and respiration', status: 'soon', colour: '#64748b' },
        { n: 13, level: 'A Level', title: 'Photosynthesis', status: 'soon', colour: '#64748b' },
        { n: 14, level: 'A Level', title: 'Homeostasis', status: 'soon', colour: '#64748b' },
        { n: 15, level: 'A Level', title: 'Control and coordination', status: 'soon', colour: '#64748b' },
        { n: 16, level: 'A Level', title: 'Inheritance', status: 'soon', colour: '#64748b' },
        { n: 17, level: 'A Level', title: 'Selection and evolution', status: 'soon', colour: '#64748b' },
        { n: 18, level: 'A Level', title: 'Classification, biodiversity and conservation', status: 'soon', colour: '#64748b' },
        { n: 19, level: 'A Level', title: 'Genetic technology', status: 'soon', colour: '#64748b' },
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
