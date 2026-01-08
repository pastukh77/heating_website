import streamlit as st
import os
from pathlib import Path
from PIL import Image
import base64
import toml

# Завантаження конфігурації (БЕЗ Streamlit декораторів, щоб працювало перед set_page_config)
def load_config():
    """Завантаження конфігурації з config.toml"""
    config_path = "config.toml"
    if os.path.exists(config_path):
        with open(config_path, "r", encoding="utf-8") as f:
            return toml.load(f)
    else:
        return {}

config = load_config()

# Налаштування сторінки
st.set_page_config(
    page_title=config.get("company", {}).get("name", "Назва підприємства"),
    page_icon=config.get("company", {}).get("icon", "🔥"),
    layout="wide",
    initial_sidebar_state="auto"  # На мобільних закритий, на десктопі відкритий
)

# Отримання кольорів з конфігу
primary_color = config.get("theme", {}).get("primary_color", "#FF6B35")
secondary_color = config.get("theme", {}).get("secondary_color", "#E55A2B")
text_color = config.get("theme", {}).get("text_color", "#2E4053")
bg_light = config.get("theme", {}).get("background_light", "#F0F2F6")
text_muted = config.get("theme", {}).get("text_muted", "#5D6D7E")

# Custom CSS для покращення дизайну
st.markdown(f"""
    <style>
    .main-header {{
        font-size: 4rem;
        font-weight: bold;
        color: {primary_color};
        text-align: center;
        padding: 1.5rem 0;
        margin-bottom: 1.5rem;
    }}

    .section-header {{
        font-size: 2rem;
        font-weight: bold;
        color: {text_color};
        margin-top: 2rem;
        margin-bottom: 1rem;
        padding: 0.5rem;
        background: linear-gradient(90deg, {primary_color} 0%, transparent 100%);
        border-radius: 5px;
    }}

    .info-box {{
        background-color: {bg_light};
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 5px solid {primary_color};
        margin-bottom: 1rem;
    }}

    .contact-item {{
        font-size: 1.1rem;
        padding: 0.5rem 0;
        display: flex;
        align-items: center;
    }}

    .contact-icon {{
        color: {primary_color};
        margin-right: 10px;
        font-size: 1.3rem;
    }}

    .document-card {{
        background-color: white;
        padding: 1.5rem;
        border-radius: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 1rem;
        border: 1px solid #E0E0E0;
        transition: transform 0.2s;
    }}

    .document-card:hover {{
        transform: translateY(-5px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }}

    /* Навігаційні картки */
    .nav-card {{
        background: linear-gradient(135deg, {bg_light} 0%, white 100%);
        padding: 1.5rem;
        border-radius: 15px;
        border: 2px solid {bg_light};
        transition: all 0.3s ease;
        height: 100%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }}

    .nav-card:hover {{
        border-color: {primary_color};
        box-shadow: 0 4px 16px rgba(255, 107, 53, 0.2);
        transform: translateY(-5px);
    }}

    .nav-card h3 {{
        color: {primary_color};
        margin-bottom: 0.5rem;
    }}

    .nav-card p {{
        color: {text_muted};
        font-size: 0.95rem;
        margin-bottom: 1rem;
    }}

    .photo-caption {{
        text-align: center;
        color: {text_muted};
        font-style: italic;
        margin-top: 0.5rem;
    }}

    .stButton>button {{
        background-color: {primary_color};
        color: white;
        border-radius: 5px;
        padding: 0.5rem 2rem;
        font-weight: bold;
        border: none;
        transition: background-color 0.3s;
    }}

    .stButton>button:hover {{
        background-color: {secondary_color};
    }}

    div[data-testid="stFileUploader"] {{
        background-color: {bg_light};
        padding: 1rem;
        border-radius: 10px;
        border: 2px dashed {primary_color};
    }}

    /* Навігаційне меню */
    .nav-container {{
        display: flex;
        justify-content: center;
        gap: 0;
        margin-bottom: 3rem;
        border-bottom: 3px solid #E0E0E0;
    }}

    .nav-item {{
        flex: 1;
        max-width: 250px;
        text-align: center;
        padding: 1.2rem 2rem;
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 600;
        color: {text_muted};
        background-color: #FFFFFF;
        border: none;
        border-bottom: 3px solid transparent;
        transition: all 0.3s ease;
        text-decoration: none;
        position: relative;
    }}

    .nav-item:hover {{
        color: {primary_color};
        background-color: #FFF5F2;
        border-bottom: 3px solid {primary_color};
    }}

    .nav-item.active {{
        color: {primary_color};
        background-color: #FFF5F2;
        border-bottom: 3px solid {primary_color};
    }}

    .nav-icon {{
        font-size: 1.5rem;
        display: block;
        margin-bottom: 0.3rem;
    }}

    /* Sidebar стилізація */
    [data-testid="stSidebar"] {{
        background: linear-gradient(180deg, {primary_color} 0%, {secondary_color} 100%);
    }}

    [data-testid="stSidebar"] * {{
        color: white !important;
    }}

    [data-testid="stSidebar"] h2 {{
        color: white !important;
        font-size: 1.5rem !important;
        margin-bottom: 0 !important;
    }}

    [data-testid="stSidebar"] h3 {{
        color: white !important;
        font-size: 1.2rem !important;
    }}

    [data-testid="stSidebar"] .stRadio > label {{
        color: white !important;
        font-weight: 600;
        font-size: 1.1rem;
    }}

    /* Приховуємо radio кнопки (кружечки) */
    [data-testid="stSidebar"] [role="radiogroup"] input[type="radio"] {{
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
    }}

    [data-testid="stSidebar"] [role="radiogroup"] label {{
        background-color: rgba(255, 255, 255, 0.15);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        margin-bottom: 0.5rem;
        transition: all 0.3s;
        cursor: pointer;
        font-size: 1.1rem;
        display: flex;
        align-items: center;
        width: 100%;
    }}

    [data-testid="stSidebar"] [role="radiogroup"] label p {{
        color: white !important;
        margin: 0;
        font-size: 1.1rem;
    }}

    [data-testid="stSidebar"] [role="radiogroup"] label:hover {{
        background-color: rgba(255, 255, 255, 0.25);
        transform: translateX(5px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }}

    [data-testid="stSidebar"] [role="radiogroup"] label[data-checked="true"] {{
        background-color: white;
        color: {primary_color} !important;
        border-left: 5px solid #FFC107;
        font-weight: bold;
    }}

    [data-testid="stSidebar"] [role="radiogroup"] label[data-checked="true"] p {{
        color: {primary_color} !important;
    }}

    /* Приховуємо кружечок radio */
    [data-testid="stSidebar"] [role="radiogroup"] label > div:first-child {{
        display: none !important;
    }}

    [data-testid="stSidebar"] hr {{
        border-color: rgba(255, 255, 255, 0.3) !important;
        margin: 1rem 0 !important;
    }}

    [data-testid="stSidebar"] .element-container {{
        color: white !important;
    }}

    [data-testid="stSidebar"] .stAlert {{
        background-color: rgba(255, 255, 255, 0.2) !important;
        border: 1px solid rgba(255, 255, 255, 0.3) !important;
        color: white !important;
    }}

    section[data-testid="stSidebar"] > div {{
        padding-top: 2rem;
    }}

    /* === МОБІЛЬНА АДАПТАЦІЯ === */
    @media only screen and (max-width: 768px) {{
        .main-header {{
            font-size: 2.5rem !important;
            padding: 1rem 0 !important;
        }}

        .section-header {{
            font-size: 1.5rem !important;
            padding: 0.3rem !important;
        }}

        .info-box {{
            padding: 1rem !important;
        }}

        .contact-item {{
            font-size: 1rem !important;
            padding: 0.3rem 0 !important;
        }}

        .nav-item {{
            padding: 0.8rem 1rem !important;
            font-size: 0.9rem !important;
        }}

        /* Sidebar на мобільних */
        [data-testid="stSidebar"] {{
            width: 280px !important;
        }}

        [data-testid="stSidebar"] [role="radiogroup"] label {{
            padding: 0.8rem 1rem !important;
            font-size: 1rem !important;
        }}

        /* Навігаційні картки на планшетах */
        .nav-card {{
            padding: 1rem !important;
        }}

        .nav-card h3 {{
            font-size: 1.2rem !important;
        }}

        .nav-card p {{
            font-size: 0.85rem !important;
        }}
    }}

    /* Дуже маленькі екрани */
    @media only screen and (max-width: 480px) {{
        .main-header {{
            font-size: 2rem !important;
        }}

        .section-header {{
            font-size: 1.3rem !important;
        }}

        /* Навігаційні картки на телефонах */
        .nav-card {{
            padding: 0.8rem !important;
            margin-bottom: 1rem !important;
        }}

        .nav-card h3 {{
            font-size: 1.1rem !important;
        }}

        .nav-card p {{
            font-size: 0.8rem !important;
        }}

        [data-testid="stSidebar"] {{
            width: 100% !important;
        }}
    }}
    </style>
""", unsafe_allow_html=True)

# Функція для відображення PDF
def display_pdf(file_path=None, pdf_data=None):
    """Відображення PDF файлу"""
    try:
        if pdf_data:
            base64_pdf = base64.b64encode(pdf_data).decode('utf-8')
            pdf_display = f'''
            <embed src="data:application/pdf;base64,{base64_pdf}"
                   width="100%"
                   height="800px"
                   type="application/pdf"
                   style="border: 1px solid #E0E0E0; border-radius: 5px;">
            '''
            st.markdown(pdf_display, unsafe_allow_html=True)
        elif file_path and os.path.exists(file_path):
            with open(file_path, "rb") as f:
                base64_pdf = base64.b64encode(f.read()).decode('utf-8')
            pdf_display = f'''
            <embed src="data:application/pdf;base64,{base64_pdf}"
                   width="100%"
                   height="800px"
                   type="application/pdf"
                   style="border: 1px solid #E0E0E0; border-radius: 5px;">
            '''
            st.markdown(pdf_display, unsafe_allow_html=True)
        else:
            st.warning("📄 Документ ще не завантажено")
    except Exception as e:
        st.error(f"Помилка при відображенні PDF: {str(e)}")
        st.info("💡 Будь ласка, скористайтесь кнопкою завантаження для перегляду документа")

# Функція для збереження файлу
def save_uploaded_file(uploaded_file, folder):
    """Збереження завантаженого файлу"""
    if uploaded_file is not None:
        file_path = os.path.join(folder, uploaded_file.name)
        with open(file_path, "wb") as f:
            f.write(uploaded_file.getbuffer())
        return file_path
    return None

# Отримання даних з конфігу
company_name = config.get("company", {}).get("name", "Назва підприємства")
company_icon = config.get("company", {}).get("icon", "🔥")

# Головний заголовок
st.markdown(f'<h1 class="main-header">{company_icon} {company_name}</h1>', unsafe_allow_html=True)

# Навігаційні пункти з іконками (з конфігу)
menu_config = config.get("menu", {}).get("items", [])
if menu_config:
    menu_items = {f"{item['icon']} {item['label']}": item['label'] for item in menu_config}
else:
    # Fallback меню
    menu_items = {
        "🏠 Головна": "Головна",
        "📄 Документи": "Документи",
        "📸 Фотогалерея": "Фотогалерея",
        "📞 Контакти": "Контакти"
    }

# Ініціалізуємо поточну сторінку в session_state
if 'current_page' not in st.session_state:
    st.session_state.current_page = "Головна"

# Отримуємо вибір з radio
selected_menu = st.sidebar.radio(
    "Оберіть розділ:",
    list(menu_items.keys()),
    index=list(menu_items.values()).index(st.session_state.current_page) if st.session_state.current_page in menu_items.values() else 0,
    label_visibility="collapsed",
    key="sidebar_menu"
)

# Оновлюємо поточну сторінку при зміні radio
selected_page = menu_items[selected_menu]
if selected_page != st.session_state.current_page:
    st.session_state.current_page = selected_page
    st.rerun()

# Отримуємо назву сторінки
page = st.session_state.current_page

# Завантаження контактів для sidebar з конфігу
contacts = config.get("contacts", {})
sidebar_phone = contacts.get("phone", "")
sidebar_email = contacts.get("email", "")

if sidebar_phone or sidebar_email:
    st.sidebar.markdown("---")
    # st.sidebar.markdown("### ⚡ Швидкий контакт")
    if sidebar_phone:
        st.sidebar.markdown("📞 **Телефон:**")
        st.sidebar.markdown(f"_{sidebar_phone}_")
    if sidebar_email:
        st.sidebar.markdown("📧 **Email:**")
        st.sidebar.markdown(f"_{sidebar_email}_")

# ==================== ГОЛОВНА СТОРІНКА ====================
if page == "Головна":
    st.markdown('<h2 class="section-header">Про нас</h2>', unsafe_allow_html=True)

    # Відображення інформації з конфігу
    company_info = config.get("company", {})
    display_name = company_info.get("name", "Назва підприємства")
    company_description = company_info.get("description", "Опис підприємства буде додано пізніше.")

    st.markdown(f"### {display_name}")
    st.markdown(company_description)


    # === КНОПКИ ШВИДКОЇ НАВІГАЦІЇ ===
    # st.markdown('<h2 class="section-header">🔗 Швидкий перехід</h2>', unsafe_allow_html=True)

    # Створюємо три колонки для кнопок
    btn_col1, btn_col2, btn_col3 = st.columns(3)

    with btn_col1:
        st.markdown("### 📄 Документи")
        st.markdown("Перегляньте наші офіційні документи та ліцензії")
        if st.button("Переглянути документи", key="nav_docs", use_container_width=True, type="primary"):
            st.session_state.current_page = "Документи"
            st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)

    with btn_col2:
        st.markdown("### 📸 Фотогалерея")
        st.markdown("Дивіться фотографії нашого обладнання та об'єктів")
        if st.button("Відкрити галерею", key="nav_photos", use_container_width=True, type="primary"):
            st.session_state.current_page = "Фотогалерея"
            st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)

    with btn_col3:
        st.markdown("### 📞 Контакти")
        st.markdown("Зв'яжіться з нами для отримання інформації")
        if st.button("Наші контакти", key="nav_contacts", use_container_width=True, type="primary"):
            st.session_state.current_page = "Контакти"
            st.rerun()
        st.markdown('</div>', unsafe_allow_html=True)

# ==================== ДОКУМЕНТИ ====================
elif page == "Документи":
    st.markdown('<h2 class="section-header">📑 Офіційні документи</h2>', unsafe_allow_html=True)

    # Отримання документів з конфігу
    docs = config.get("documents", {})
    license1_doc = docs.get("license1", {})
    license2_doc = docs.get("license2", {})
    license3_doc = docs.get("license3", {})
    tariff_doc = docs.get("tariff", {})

    max_pdf_size = config.get("settings", {}).get("max_pdf_size_mb", 10)

    # Створення вкладок для різних документів
    tab1, tab2, tab3, tab4 = st.tabs([
        license1_doc.get("title", "Ліцензія 1"),
        license2_doc.get("title", "Ліцензія 2"),
        license3_doc.get("title", "Ліцензія 3"),
        tariff_doc.get("title", "Тарифи на теплопостачання")
    ])

    with tab1:
        st.markdown(f"{license1_doc.get('full_title', 'Ліцензія 1')}")

        # Відображення документа
        license1_path = os.path.join(
            license1_doc.get("folder", "documents"),
            license1_doc.get("filename", "Ліцензія1.pdf")
        )

        if os.path.exists(license1_path):
            # Читаємо файл один раз
            with open(license1_path, "rb") as file:
                license1_pdf_data = file.read()

            # Кнопка завантаження
            st.download_button(
                label="⬇️ Завантажити документ",
                data=license1_pdf_data,
                file_name=license1_doc.get("filename", "Ліцензія1.pdf"),
                mime="application/pdf",
                key="download_license1"
            )

            st.markdown("#### 📄 Перегляд документа:")

            # Перевіряємо розмір файлу
            file_size_mb = len(license1_pdf_data) / (1024 * 1024)
            if file_size_mb > max_pdf_size:
                st.warning(f"📄 Файл занадто великий ({file_size_mb:.1f} MB) для перегляду в браузері. Будь ласка, завантажте його для перегляду.")
            else:
                display_pdf(pdf_data=license1_pdf_data)
        else:
            st.warning("📄 Документ не знайдено.")

    with tab2:
        st.markdown(f"{license2_doc.get('full_title', 'Ліцензія 2')}")

        # Відображення документа
        license2_path = os.path.join(
            license2_doc.get("folder", "documents"),
            license2_doc.get("filename", "Ліцензія2.pdf")
        )

        if os.path.exists(license2_path):
            # Читаємо файл один раз
            with open(license2_path, "rb") as file:
                license2_pdf_data = file.read()

            # Кнопка завантаження
            st.download_button(
                label="⬇️ Завантажити документ",
                data=license2_pdf_data,
                file_name=license2_doc.get("filename", "Ліцензія2.pdf"),
                mime="application/pdf",
                key="download_license2"
            )

            st.markdown("#### 📄 Перегляд документа:")

            # Перевіряємо розмір файлу
            file_size_mb = len(license2_pdf_data) / (1024 * 1024)
            if file_size_mb > max_pdf_size:
                st.warning(f"📄 Файл занадто великий ({file_size_mb:.1f} MB) для перегляду в браузері. Будь ласка, завантажте його для перегляду.")
            else:
                display_pdf(pdf_data=license2_pdf_data)
        else:
            st.warning("📄 Документ не знайдено.")

    with tab3:
        st.markdown(f"{license3_doc.get('full_title', 'Ліцензія 3')}")

        # Відображення документа
        license3_path = os.path.join(
            license3_doc.get("folder", "documents"),
            license3_doc.get("filename", "Ліцензія3.pdf")
        )

        if os.path.exists(license3_path):
            # Читаємо файл один раз
            with open(license3_path, "rb") as file:
                license3_pdf_data = file.read()

            # Кнопка завантаження
            st.download_button(
                label="⬇️ Завантажити документ",
                data=license3_pdf_data,
                file_name=license3_doc.get("filename", "Ліцензія3.pdf"),
                mime="application/pdf",
                key="download_license3"
            )

            st.markdown("#### 📄 Перегляд документа:")

            # Перевіряємо розмір файлу
            file_size_mb = len(license3_pdf_data) / (1024 * 1024)
            if file_size_mb > max_pdf_size:
                st.warning(f"📄 Файл занадто великий ({file_size_mb:.1f} MB) для перегляду в браузері. Будь ласка, завантажте його для перегляду.")
            else:
                display_pdf(pdf_data=license3_pdf_data)
        else:
            st.warning("📄 Документ не знайдено.")

    with tab4:
        st.markdown(f"{tariff_doc.get('full_title', 'Тариф на послуги з теплопостачання')}")

        # Відображення документа
        tariff_path = os.path.join(
            tariff_doc.get("folder", "documents"),
            tariff_doc.get("filename", "Тариф.pdf")
        )

        if os.path.exists(tariff_path):
            # Читаємо файл один раз
            with open(tariff_path, "rb") as file:
                tariff_pdf_data = file.read()

            # Кнопка завантаження
            st.download_button(
                label="⬇️ Завантажити тариф",
                data=tariff_pdf_data,
                file_name=tariff_doc.get("filename", "Тариф.pdf"),
                mime="application/pdf",
                key="download_tariff"
            )

            st.markdown("#### 📄 Перегляд документа:")

            # Перевіряємо розмір файлу
            file_size_mb = len(tariff_pdf_data) / (1024 * 1024)
            if file_size_mb > max_pdf_size:
                st.warning(f"📄 Файл занадто великий ({file_size_mb:.1f} MB) для перегляду в браузері. Будь ласка, завантажте його для перегляду.")
            else:
                display_pdf(pdf_data=tariff_pdf_data)
        else:
            st.warning("📄 Документ не знайдено.")

# ==================== ФОТОГАЛЕРЕЯ ====================
elif page == "Фотогалерея":
    st.markdown('<h2 class="section-header">📸 Фотогалерея</h2>', unsafe_allow_html=True)

    # Отримання налаштувань галереї з конфігу
    gallery = config.get("gallery", {})
    photos_folder = gallery.get("folder", "photos")
    supported_formats = tuple(gallery.get("supported_formats", [".png", ".jpg", ".jpeg"]))

    # Відображення галереї
    if os.path.exists(photos_folder):
        photo_files = [f for f in os.listdir(photos_folder) if f.lower().endswith(supported_formats)]

        if photo_files:
            # Відображення фото в одну колонку
            for photo_file in photo_files:
                image_path = os.path.join(photos_folder, photo_file)
                image = Image.open(image_path)
                st.image(image, use_column_width=True)
        else:
            st.info("📷 Фотографій ще немає в галереї.")
    else:
        st.info("📷 Фотографій ще немає в галереї.")

# ==================== КОНТАКТИ ====================
elif page == "Контакти":
    st.markdown('<h2 class="section-header">📞 Контактна інформація</h2>', unsafe_allow_html=True)

    # Завантаження контактів з конфігу
    contacts_info = config.get("contacts", {})
    contact_phone = contacts_info.get("phone", "Телефон буде додано")
    contact_email = contacts_info.get("email", "Email буде додано")
    contact_address = contacts_info.get("address", "Адреса буде додана")

    st.markdown(f"""
    <div class="contact-item">
        <span class="contact-icon">📞</span>
        <strong>Телефон:</strong>&nbsp;{contact_phone}
    </div>
    <div class="contact-item">
        <span class="contact-icon">📧</span>
        <strong>Email:</strong>&nbsp;{contact_email}
    </div>
    <div class="contact-item">
        <span class="contact-icon">📍</span>
        <strong>Адреса:</strong>&nbsp;{contact_address}
    </div>
    """, unsafe_allow_html=True)

    st.markdown('</div>', unsafe_allow_html=True)

# Футер
st.markdown("---")

# Отримання даних футера з конфігу
footer_config = config.get("footer", {})
footer_copyright = footer_config.get("copyright", f"© 2024 {company_name}. Всі права захищено.")
show_tagline = footer_config.get("show_tagline", False)
tagline = config.get("company", {}).get("tagline", "Тепло для вашого комфорту")

footer_html = f"""
    <div style="text-align: center; color: {text_muted}; padding: 1rem;">
        <p>{footer_copyright}</p>
"""

if show_tagline:
    footer_html += f"        <p>{company_icon} {tagline}</p>\n"

footer_html += "    </div>"

st.markdown(footer_html, unsafe_allow_html=True)
