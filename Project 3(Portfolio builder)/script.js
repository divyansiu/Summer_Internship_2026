document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const form = document.getElementById('portfolioForm');
    const inputs = document.querySelectorAll('.input-field');
    const profileImgInput = document.getElementById('profileImg');
    const themeToggle = document.getElementById('themeToggle');
    const templateSelect = document.getElementById('templateSelect');
    const downloadBtn = document.getElementById('downloadBtn');
    const resumeDocument = document.getElementById('resumeDocument');

    // --- Smart Feature: Live Preview Engine ---
    // Maps standard inputs to their target text areas instantly
    inputs.forEach(input => {
        if (input.dataset.target) {
            input.addEventListener('input', (e) => {
                const targetEl = document.getElementById(e.target.dataset.target);
                if (targetEl) {
                    // Update text, fallback to placeholder logic or empty
                    targetEl.textContent = e.target.value || e.target.placeholder;
                }
            });
        }
    });

    // --- Profile Image Upload ---
    profileImgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = document.getElementById('prevImg');
                img.src = event.target.result;
                // Reveal image for minimal template if uploaded
                if(resumeDocument.classList.contains('template-minimal')){
                    document.querySelector('.template-minimal .res-profile-img').style.display = 'block';
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // --- Skills Tag Converter ---
    const skillsInput = document.getElementById('skills');
    skillsInput.addEventListener('input', (e) => {
        const skillsContainer = document.getElementById('prevSkills');
        const skillsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
        
        if (skillsArray.length === 0) {
            skillsContainer.innerHTML = `<span class="skill-pill">React</span><span class="skill-pill">TypeScript</span><span class="skill-pill">CSS</span>`;
            return;
        }

        skillsContainer.innerHTML = '';
        skillsArray.forEach(skill => {
            const span = document.createElement('span');
            span.className = 'skill-pill';
            span.textContent = skill;
            skillsContainer.appendChild(span);
        });
    });

    // --- Certifications Converter ---
    const certsInput = document.getElementById('certifications');
    certsInput.addEventListener('input', (e) => {
        const certsContainer = document.getElementById('prevCerts');
        const certsArray = e.target.value.split(',').map(s => s.trim()).filter(s => s !== '');
        
        if (certsArray.length === 0) {
            certsContainer.innerHTML = `<li>AWS Certified Developer</li>`;
            return;
        }

        certsContainer.innerHTML = '';
        certsArray.forEach(cert => {
            const li = document.createElement('li');
            li.textContent = cert;
            certsContainer.appendChild(li);
        });
    });

    // --- Advanced Card Parser (Experience & Projects) ---
    // Parses textarea input formatted with pipelines (|) into beautiful UI cards
    const parseCards = (inputText, containerId, isProject) => {
        const container = document.getElementById(containerId);
        if (!inputText.trim()) {
            // Restore defaults if empty
            if (isProject) {
                container.innerHTML = `
                    <div class="res-card">
                        <h4>E-commerce App</h4>
                        <p class="res-tech">React, Node</p>
                        <p>Built a scalable store serving millions of users.</p>
                    </div>`;
            } else {
                container.innerHTML = `
                    <div class="res-card">
                        <h4>Senior Dev <span class="accent-text">| Acme Corp</span></h4>
                        <p class="res-date">2020 - Present</p>
                        <p>Led the frontend team to build high-performance web applications.</p>
                    </div>`;
            }
            return;
        }

        const lines = inputText.split('\n').filter(line => line.trim() !== '');
        container.innerHTML = '';

        lines.forEach(line => {
            const parts = line.split('|').map(p => p.trim());
            const card = document.createElement('div');
            card.className = 'res-card';

            if (isProject) {
                // Format: Project Name | Tech Stack | Description
                const name = parts[0] || 'Project Name';
                const tech = parts[1] || '';
                const desc = parts[2] || '';
                
                card.innerHTML = `
                    <h4>${name}</h4>
                    ${tech ? `<p class="res-tech">${tech}</p>` : ''}
                    ${desc ? `<p>${desc}</p>` : ''}
                `;
            } else {
                // Format: Role | Company | Dates | Description
                const role = parts[0] || 'Role';
                const company = parts[1] ? `<span class="accent-text">| ${parts[1]}</span>` : '';
                const date = parts[2] || '';
                const desc = parts[3] || '';

                card.innerHTML = `
                    <h4>${role} ${company}</h4>
                    ${date ? `<p class="res-date">${date}</p>` : ''}
                    ${desc ? `<p>${desc}</p>` : ''}
                `;
            }
            container.appendChild(card);
        });
    };

    document.getElementById('experience').addEventListener('input', (e) => {
        parseCards(e.target.value, 'prevExperience', false);
    });

    document.getElementById('projects').addEventListener('input', (e) => {
        parseCards(e.target.value, 'prevProjects', true);
    });

    document.getElementById('education').addEventListener('input', (e) => {
        // Reuse project parser logic for education (Title | Subtitle/Dates | Desc)
        parseCards(e.target.value, 'prevEducation', true);
    });


    // --- Template Switching System ---
    templateSelect.addEventListener('change', (e) => {
        resumeDocument.className = `resume-document template-${e.target.value}`;
        
        // Hide profile image on minimal by default unless user uploaded one
        if(e.target.value === 'minimal' && !profileImgInput.files.length) {
            document.querySelector('.template-minimal .res-profile-img').style.display = 'none';
        } else if(document.querySelector('.res-profile-img')) {
            document.querySelector('.res-profile-img').style.display = 'block';
        }
    });

    // --- Theme Switcher (Dark/Light Mode) ---
    themeToggle.addEventListener('click', () => {
        const body = document.body;
        if (body.classList.contains('dark-theme')) {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeToggle.textContent = '🌙';
        } else {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeToggle.textContent = '🌓';
        }
    });

    // --- Export Feature (PDF via Print) ---
    downloadBtn.addEventListener('click', () => {
        // Slight delay ensures the UI stabilizes before browser print dialog
        setTimeout(() => {
            window.print();
        }, 100);
    });
});