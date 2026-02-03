const fs = require('fs');
const path = require('path');

const configsDir = './configs';
const configFiles = fs.readdirSync(configsDir).filter(f => f.endsWith('.json'));

function generateIndexHtml(config) {
    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${config.companyName}</title>
    <link rel="stylesheet" href="../style.css">
    <style>
        :root { --primary-color: ${config.color}; }
        .header { background: linear-gradient(135deg, var(--primary-color) 0%, ${config.colorLight} 100%); }
        .nav-link:hover, .nav-link.active { background-color: var(--primary-color); }
        .btn { background-color: var(--primary-color); }
        .btn:hover { background-color: ${config.colorDark}; }
        .nav-card:hover { border-color: var(--primary-color); }
        .tab-btn.active { background-color: var(--primary-color); }
    </style>
</head>
<body>
    <header class="header">
        <h1>${config.companyName}</h1>
    </header>
    <nav class="nav">
        <ul class="nav-list">
            <li class="nav-item"><a href="/${config.slug}" class="nav-link active"><span class="nav-icon">🏠</span>Головна</a></li>
            <li class="nav-item"><a href="/${config.slug}/documents" class="nav-link"><span class="nav-icon">📄</span>Документи</a></li>
            <li class="nav-item"><a href="/${config.slug}/gallery" class="nav-link"><span class="nav-icon">📸</span>Фотогалерея</a></li>
            <li class="nav-item"><a href="/${config.slug}/contacts" class="nav-link"><span class="nav-icon">📞</span>Контакти</a></li>
        </ul>
    </nav>
    <main class="main">
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
        :root { --primary-color: ${config.color}; }
        .header { background: linear-gradient(135deg, var(--primary-color) 0%, ${config.colorLight} 100%); }
        .nav-link:hover, .nav-link.active { background-color: var(--primary-color); }
        .btn { background-color: var(--primary-color); }
        .btn:hover { background-color: ${config.colorDark}; }
        .tab-btn.active { background-color: var(--primary-color); }
    </style>
</head>
<body>
    <header class="header">
        <h1>${config.companyName}</h1>
    </header>
    <nav class="nav">
        <ul class="nav-list">
            <li class="nav-item"><a href="/${config.slug}" class="nav-link"><span class="nav-icon">🏠</span>Головна</a></li>
            <li class="nav-item"><a href="/${config.slug}/documents" class="nav-link active"><span class="nav-icon">📄</span>Документи</a></li>
            <li class="nav-item"><a href="/${config.slug}/gallery" class="nav-link"><span class="nav-icon">📸</span>Фотогалерея</a></li>
            <li class="nav-item"><a href="/${config.slug}/contacts" class="nav-link"><span class="nav-icon">📞</span>Контакти</a></li>
        </ul>
    </nav>
    <main class="main">
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
        :root { --primary-color: ${config.color}; }
        .header { background: linear-gradient(135deg, var(--primary-color) 0%, ${config.colorLight} 100%); }
        .nav-link:hover, .nav-link.active { background-color: var(--primary-color); }
        .btn { background-color: var(--primary-color); }
        .btn:hover { background-color: ${config.colorDark}; }
    </style>
</head>
<body>
    <header class="header">
        <h1>${config.companyName}</h1>
    </header>
    <nav class="nav">
        <ul class="nav-list">
            <li class="nav-item"><a href="/${config.slug}" class="nav-link"><span class="nav-icon">🏠</span>Головна</a></li>
            <li class="nav-item"><a href="/${config.slug}/documents" class="nav-link"><span class="nav-icon">📄</span>Документи</a></li>
            <li class="nav-item"><a href="/${config.slug}/gallery" class="nav-link active"><span class="nav-icon">📸</span>Фотогалерея</a></li>
            <li class="nav-item"><a href="/${config.slug}/contacts" class="nav-link"><span class="nav-icon">📞</span>Контакти</a></li>
        </ul>
    </nav>
    <main class="main">
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
    return `<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Контакти - ${config.companyName}</title>
    <link rel="stylesheet" href="../../style.css">
    <style>
        :root { --primary-color: ${config.color}; }
        .header { background: linear-gradient(135deg, var(--primary-color) 0%, ${config.colorLight} 100%); }
        .nav-link:hover, .nav-link.active { background-color: var(--primary-color); }
        .btn { background-color: var(--primary-color); }
        .btn:hover { background-color: ${config.colorDark}; }
    </style>
</head>
<body>
    <header class="header">
        <h1>${config.companyName}</h1>
    </header>
    <nav class="nav">
        <ul class="nav-list">
            <li class="nav-item"><a href="/${config.slug}" class="nav-link"><span class="nav-icon">🏠</span>Головна</a></li>
            <li class="nav-item"><a href="/${config.slug}/documents" class="nav-link"><span class="nav-icon">📄</span>Документи</a></li>
            <li class="nav-item"><a href="/${config.slug}/gallery" class="nav-link"><span class="nav-icon">📸</span>Фотогалерея</a></li>
            <li class="nav-item"><a href="/${config.slug}/contacts" class="nav-link active"><span class="nav-icon">📞</span>Контакти</a></li>
        </ul>
    </nav>
    <main class="main">
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

    console.log(`✓ Built: ${config.companyName} (/${config.slug})`);
}

console.log('\nDone! All sites have been generated.');
