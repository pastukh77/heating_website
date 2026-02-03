const fs = require('fs');
const path = require('path');

const configsDir = './configs';
const configFiles = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

// Style variants for different looks
const styleVariants = {
    // Classic - original centered style
    classic: {
        headerClass: '',
        navClass: '',
        containerClass: '',
        extraStyles: ''
    },
    // Modern - full-width header, shadow nav, card hover effects
    modern: {
        headerClass: 'header--modern',
        navClass: 'nav--modern',
        containerClass: '',
        extraStyles: `
        .header--modern { padding: 2.5rem 0; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
        .header--modern h1 { font-size: 2.8rem; letter-spacing: 1px; text-transform: uppercase; }
        .nav--modern { background: #1a1a2e; border-bottom: none; }
        .nav--modern .nav-link { color: #fff; opacity: 0.7; }
        .nav--modern .nav-link:hover, .nav--modern .nav-link.active { opacity: 1; background: rgba(255,255,255,0.1); }
        .nav--modern .nav-icon { font-size: 1.8rem; }
        .info-box { border-left: none; border-radius: 20px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
        .nav-card { border-radius: 20px; border: none; box-shadow: 0 8px 30px rgba(0,0,0,0.12); }
        .nav-card:hover { transform: translateY(-10px); box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
        .section-header { background: none; color: var(--primary-color); border-left: 5px solid var(--primary-color); padding-left: 1rem; }
        `
    },
    // Minimal - clean lines, less decoration
    minimal: {
        headerClass: 'header--minimal',
        navClass: 'nav--minimal',
        containerClass: '',
        extraStyles: `
        .header--minimal { background: var(--primary-color); padding: 1rem 0; }
        .header--minimal h1 { font-size: 1.8rem; font-weight: 400; }
        .nav--minimal { border-bottom: 1px solid #eee; }
        .nav--minimal .nav-link { border-bottom: none; font-weight: 400; }
        .nav--minimal .nav-link:hover, .nav--minimal .nav-link.active { background: none; color: var(--primary-color); }
        .nav--minimal .nav-icon { display: none; }
        .info-box { background: #fff; border: 1px solid #eee; border-left: 3px solid var(--primary-color); border-radius: 0; }
        .nav-card { border-radius: 0; border: 1px solid #eee; box-shadow: none; }
        .nav-card:hover { border-color: var(--primary-color); transform: none; box-shadow: none; }
        .section-header { background: none; color: var(--text-color); font-weight: 400; border-bottom: 2px solid var(--primary-color); border-radius: 0; padding: 0.5rem 0; }
        .btn { border-radius: 0; }
        `
    },
    // Corporate - professional, structured
    corporate: {
        headerClass: 'header--corporate',
        navClass: 'nav--corporate',
        containerClass: '',
        extraStyles: `
        .header--corporate { background: linear-gradient(180deg, var(--primary-color) 0%, ${`var(--primary-color)`} 100%); padding: 1.2rem 0; text-align: left; }
        .header--corporate h1 { max-width: 1200px; margin: 0 auto; padding: 0 1rem; font-size: 1.6rem; }
        .nav--corporate { background: #2c2c2c; border-bottom: 4px solid var(--primary-color); }
        .nav--corporate .nav-list { justify-content: flex-start; }
        .nav--corporate .nav-link { color: #fff; padding: 1rem 1.5rem; }
        .nav--corporate .nav-link:hover, .nav--corporate .nav-link.active { background: var(--primary-color); }
        .nav--corporate .nav-icon { display: inline; margin-right: 8px; font-size: 1rem; }
        .info-box { border-radius: 5px; border-left: 4px solid var(--primary-color); }
        .nav-cards { grid-template-columns: repeat(3, 1fr); }
        .nav-card { border-radius: 5px; border-top: 4px solid var(--primary-color); }
        .section-header { background: var(--primary-color); border-radius: 0; }
        .footer { background: #2c2c2c; color: #fff; }
        .footer p { color: #ccc; }
        `
    },
    // Rounded - soft, friendly with rounded elements
    rounded: {
        headerClass: 'header--rounded',
        navClass: 'nav--rounded',
        containerClass: '',
        extraStyles: `
        .header--rounded { border-radius: 0 0 50px 50px; padding: 2rem 0; }
        .header--rounded h1 { font-size: 2rem; }
        .nav--rounded { border-radius: 30px; margin: 1rem auto; max-width: 800px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border: none; }
        .nav--rounded .nav-list { padding: 0.5rem; }
        .nav--rounded .nav-link { border-radius: 20px; padding: 0.8rem 1.2rem; margin: 0.2rem; }
        .nav--rounded .nav-link:hover, .nav--rounded .nav-link.active { background: var(--primary-color); color: #fff; }
        .info-box { border-radius: 30px; border-left: none; border: 2px solid var(--primary-color); }
        .nav-card { border-radius: 30px; }
        .nav-card:hover { border-radius: 30px; }
        .section-header { border-radius: 30px; text-align: center; }
        .btn { border-radius: 25px; padding: 0.8rem 2rem; }
        .tab-btn { border-radius: 20px; margin: 0.3rem; }
        .tab-btn.active { background: var(--primary-color); color: #fff; border-bottom: none; }
        .tabs { border-bottom: none; justify-content: center; }
        .document-section { border-radius: 20px; }
        .gallery-item img { border-radius: 30px; }
        `
    },
    // Sidebar - navigation on left side
    sidebar: {
        headerClass: 'header--sidebar',
        navClass: 'nav--sidebar',
        containerClass: 'layout--sidebar',
        extraStyles: `
        body { display: flex; flex-direction: column; }
        @media (min-width: 769px) {
            .layout--sidebar { display: flex; }
            .nav--sidebar { position: fixed; left: 0; top: 0; width: 220px; height: 100vh; flex-direction: column; border-bottom: none; border-right: 3px solid #E0E0E0; background: #f8f9fa; z-index: 100; }
            .nav--sidebar .nav-list { flex-direction: column; padding-top: 80px; }
            .nav--sidebar .nav-item { max-width: none; }
            .nav--sidebar .nav-link { text-align: left; padding: 1rem 1.5rem; border-bottom: none; border-left: 4px solid transparent; }
            .nav--sidebar .nav-link:hover, .nav--sidebar .nav-link.active { border-left-color: var(--primary-color); background: #fff; }
            .header--sidebar { margin-left: 220px; text-align: left; padding-left: 2rem; }
            .main { margin-left: 220px; }
            .footer { margin-left: 220px; }
        }
        .info-box { border-left: 4px solid var(--primary-color); }
        .section-header { background: none; color: var(--primary-color); border-left: 4px solid var(--primary-color); padding-left: 1rem; }
        `
    }
};

function getStyleVariant(config) {
    return styleVariants[config.styleVariant] || styleVariants.classic;
}

function generateIndexHtml(config) {
    const variant = getStyleVariant(config);
    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.companyName}</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        :root { --primary-color: ${config.color}; --secondary-color: ${config.colorDark}; }
        .header { background: linear-gradient(135deg, var(--primary-color) 0%, ${config.colorLight} 100%); }
        .nav-link:hover, .nav-link.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
        .btn { background-color: var(--primary-color); }
        .btn:hover { background-color: ${config.colorDark}; }
        .nav-card:hover { border-color: var(--primary-color); }
        .tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
        .nav-card h3 { color: var(--primary-color); }
        .contact-icon { color: var(--primary-color); }
        .contact-item a { color: var(--primary-color); }
        .info-box { border-left-color: var(--primary-color); }
        ${variant.extraStyles}
    </style>
</head>
<body>
    <header class="header ${variant.headerClass}">
        <h1>${config.companyName}</h1>
    </header>
    <nav class="nav ${variant.navClass}">
        <ul class="nav-list">
            <li class="nav-item"><a href="/${config.slug}" class="nav-link active"><span class="nav-icon">🏠</span>Головна</a></li>
            <li class="nav-item"><a href="/${config.slug}/documents" class="nav-link"><span class="nav-icon">📄</span>Документи</a></li>
            <li class="nav-item"><a href="/${config.slug}/gallery" class="nav-link"><span class="nav-icon">📸</span>Фотогалерея</a></li>
            <li class="nav-item"><a href="/${config.slug}/contacts" class="nav-link"><span class="nav-icon">📞</span>Контакти</a></li>
        </ul>
    </nav>
    <main class="main ${variant.containerClass}">
        <div class="container">
            <h2 class="section-header">Про нас</h2>
            <div class="info-box">
                <h3>${config.companyName}</h3>
                <p>${config.description}</p>
                <p>${config.additionalInfo}</p>
            </div>
            <div class="nav-cards">
                <a href="/${config.slug}/documents" class="nav-card">
                    <h3>📄 Документи</h3>
                    <p>Перегляньте наші офіційні документи та ліцензії</p>
                    <span class="btn">Переглянути документи</span>
                </a>
                <a href="/${config.slug}/gallery" class="nav-card">
                    <h3>📸 Фотогалерея</h3>
                    <p>Дивіться фотографії нашого обладнання та об'єктів</p>
                    <span class="btn">Відкрити галерею</span>
                </a>
                <a href="/${config.slug}/contacts" class="nav-card">
                    <h3>📞 Контакти</h3>
                    <p>Зв'яжіться з нами для отримання інформації</p>
                    <span class="btn">Наші контакти</span>
                </a>
            </div>
        </div>
    </main>
    <footer class="footer">
        <p>&copy; 2025 ${config.companyName}. Всі права захищено.</p>
    </footer>
</body>
</html>`;
}

function generateDocumentsHtml(config) {
    const variant = getStyleVariant(config);
    const tabs = config.documents.map((doc, i) =>
        `<button class="tab-btn${i === 0 ? ' active' : ''}" onclick="openTab(event, '${doc.id}')">${doc.title}</button>`
    ).join('\n                ');

    const contents = config.documents.map((doc, i) => `
            <div id="${doc.id}" class="tab-content${i === 0 ? ' active' : ''}">
                <div class="document-section">
                    <h4>${doc.fullTitle}</h4>
                    <div class="document-actions">
                        <a href="/${config.slug}/${config.docsFolder}/${doc.file}" class="btn" download>⬇️ Завантажити документ</a>
                    </div>
                    <h4>📄 Перегляд документа:</h4>
                    <embed src="/${config.slug}/${config.docsFolder}/${doc.file}" class="pdf-viewer" type="application/pdf">
                </div>
            </div>`
    ).join('\n');

    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Документи - ${config.companyName}</title>
    <link rel="stylesheet" href="../../style.css">
    <style>
        :root { --primary-color: ${config.color}; --secondary-color: ${config.colorDark}; }
        .header { background: linear-gradient(135deg, var(--primary-color) 0%, ${config.colorLight} 100%); }
        .nav-link:hover, .nav-link.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
        .btn { background-color: var(--primary-color); }
        .btn:hover { background-color: ${config.colorDark}; }
        .tab-btn.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
        .info-box { border-left-color: var(--primary-color); }
        ${variant.extraStyles}
    </style>
</head>
<body>
    <header class="header ${variant.headerClass}">
        <h1>${config.companyName}</h1>
    </header>
    <nav class="nav ${variant.navClass}">
        <ul class="nav-list">
            <li class="nav-item"><a href="/${config.slug}" class="nav-link"><span class="nav-icon">🏠</span>Головна</a></li>
            <li class="nav-item"><a href="/${config.slug}/documents" class="nav-link active"><span class="nav-icon">📄</span>Документи</a></li>
            <li class="nav-item"><a href="/${config.slug}/gallery" class="nav-link"><span class="nav-icon">📸</span>Фотогалерея</a></li>
            <li class="nav-item"><a href="/${config.slug}/contacts" class="nav-link"><span class="nav-icon">📞</span>Контакти</a></li>
        </ul>
    </nav>
    <main class="main ${variant.containerClass}">
        <div class="container">
            <h2 class="section-header">📑 Офіційні документи</h2>
            <div class="tabs">
                ${tabs}
            </div>
${contents}
        </div>
    </main>
    <footer class="footer">
        <p>&copy; 2025 ${config.companyName}. Всі права захищено.</p>
    </footer>
    <script>
        function openTab(evt, tabName) {
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            evt.currentTarget.classList.add('active');
        }
    </script>
</body>
</html>`;
}

function generateGalleryHtml(config) {
    const variant = getStyleVariant(config);
    const photos = config.photos.map(photo =>
        `<div class="gallery-item"><img src="/${config.slug}/${config.photosFolder}/${photo}" alt="${photo}" loading="lazy"></div>`
    ).join('\n                ');

    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Фотогалерея - ${config.companyName}</title>
    <link rel="stylesheet" href="../../style.css">
    <style>
        :root { --primary-color: ${config.color}; --secondary-color: ${config.colorDark}; }
        .header { background: linear-gradient(135deg, var(--primary-color) 0%, ${config.colorLight} 100%); }
        .nav-link:hover, .nav-link.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
        .btn { background-color: var(--primary-color); }
        .btn:hover { background-color: ${config.colorDark}; }
        .info-box { border-left-color: var(--primary-color); }
        ${variant.extraStyles}
    </style>
</head>
<body>
    <header class="header ${variant.headerClass}">
        <h1>${config.companyName}</h1>
    </header>
    <nav class="nav ${variant.navClass}">
        <ul class="nav-list">
            <li class="nav-item"><a href="/${config.slug}" class="nav-link"><span class="nav-icon">🏠</span>Головна</a></li>
            <li class="nav-item"><a href="/${config.slug}/documents" class="nav-link"><span class="nav-icon">📄</span>Документи</a></li>
            <li class="nav-item"><a href="/${config.slug}/gallery" class="nav-link active"><span class="nav-icon">📸</span>Фотогалерея</a></li>
            <li class="nav-item"><a href="/${config.slug}/contacts" class="nav-link"><span class="nav-icon">📞</span>Контакти</a></li>
        </ul>
    </nav>
    <main class="main ${variant.containerClass}">
        <div class="container">
            <h2 class="section-header">📸 Фотогалерея</h2>
            <div class="gallery">
                ${photos}
            </div>
        </div>
    </main>
    <footer class="footer">
        <p>&copy; 2025 ${config.companyName}. Всі права захищено.</p>
    </footer>
</body>
</html>`;
}

function generateContactsHtml(config) {
    const variant = getStyleVariant(config);
    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Контакти - ${config.companyName}</title>
    <link rel="stylesheet" href="../../style.css">
    <style>
        :root { --primary-color: ${config.color}; --secondary-color: ${config.colorDark}; }
        .header { background: linear-gradient(135deg, var(--primary-color) 0%, ${config.colorLight} 100%); }
        .nav-link:hover, .nav-link.active { color: var(--primary-color); border-bottom-color: var(--primary-color); }
        .btn { background-color: var(--primary-color); }
        .btn:hover { background-color: ${config.colorDark}; }
        .contact-icon { color: var(--primary-color); }
        .contact-item a { color: var(--primary-color); }
        .info-box { border-left-color: var(--primary-color); }
        ${variant.extraStyles}
    </style>
</head>
<body>
    <header class="header ${variant.headerClass}">
        <h1>${config.companyName}</h1>
    </header>
    <nav class="nav ${variant.navClass}">
        <ul class="nav-list">
            <li class="nav-item"><a href="/${config.slug}" class="nav-link"><span class="nav-icon">🏠</span>Головна</a></li>
            <li class="nav-item"><a href="/${config.slug}/documents" class="nav-link"><span class="nav-icon">📄</span>Документи</a></li>
            <li class="nav-item"><a href="/${config.slug}/gallery" class="nav-link"><span class="nav-icon">📸</span>Фотогалерея</a></li>
            <li class="nav-item"><a href="/${config.slug}/contacts" class="nav-link active"><span class="nav-icon">📞</span>Контакти</a></li>
        </ul>
    </nav>
    <main class="main ${variant.containerClass}">
        <div class="container">
            <h2 class="section-header">📞 Контактна інформація</h2>
            <div class="info-box">
                <ul class="contact-list">
                    <li class="contact-item">
                        <span class="contact-icon">📞</span>
                        <div><strong>Телефон:</strong><br><a href="tel:${config.phoneRaw}">${config.phone}</a></div>
                    </li>
                    <li class="contact-item">
                        <span class="contact-icon">📧</span>
                        <div><strong>Email:</strong><br><a href="mailto:${config.email}">${config.email}</a></div>
                    </li>
                    <li class="contact-item">
                        <span class="contact-icon">📍</span>
                        <div><strong>Адреса:</strong><br>${config.address}</div>
                    </li>
                </ul>
            </div>
        </div>
    </main>
    <footer class="footer">
        <p>&copy; 2025 ${config.companyName}. Всі права захищено.</p>
    </footer>
</body>
</html>`;
}

// Build all sites
console.log('Building sites...\n');

for (const file of configFiles) {
    const configPath = path.join(configsDir, file);
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    const siteDir = `./${config.slug}`;
    const docsDir = `${siteDir}/documents`;
    const galleryDir = `${siteDir}/gallery`;
    const contactsDir = `${siteDir}/contacts`;

    // Create directories
    if (!fs.existsSync(siteDir)) fs.mkdirSync(siteDir, { recursive: true });
    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true });
    if (!fs.existsSync(contactsDir)) fs.mkdirSync(contactsDir, { recursive: true });

    // Generate HTML files
    fs.writeFileSync(`${siteDir}/index.html`, generateIndexHtml(config));
    fs.writeFileSync(`${docsDir}/index.html`, generateDocumentsHtml(config));
    fs.writeFileSync(`${galleryDir}/index.html`, generateGalleryHtml(config));
    fs.writeFileSync(`${contactsDir}/index.html`, generateContactsHtml(config));

    const variantName = config.styleVariant || 'classic';
    console.log(`✓ Built: ${config.companyName} (/${config.slug}) [${variantName}]`);
}

console.log('\nDone! All sites have been generated.');
