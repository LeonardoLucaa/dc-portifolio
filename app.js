const CONTATO = {
    email: 'luizcarv@gmail.com',
    whatsapp: '5500000000000',
    whatsappTexto: '(00) 00000-0000',
    instagram: 'luizdecarvalho_'
};

const botao = document.querySelector('.menu-botao');
const menu = document.getElementById('menu');

botao.addEventListener('click', () => {
    const aberto = menu.classList.toggle('menu--aberto');
    botao.setAttribute('aria-expanded', String(aberto));
});

document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') {
        menu.classList.remove('menu--aberto');
        botao.setAttribute('aria-expanded', 'false');
    }
});

document.querySelectorAll('[data-contato]').forEach((link) => {
    const tipo = link.dataset.contato;
    if (tipo === 'email') { link.href = `mailto:${CONTATO.email}`; link.textContent = CONTATO.email; }
    if (tipo === 'whatsapp') { link.href = `https://wa.me/${CONTATO.whatsapp}`; link.textContent = CONTATO.whatsappTexto; }
    if (tipo === 'instagram') { link.href = `https://instagram.com/${CONTATO.instagram}`; link.textContent = `@${CONTATO.instagram}`; }
});

// Formulários: cada campo tem uma regra que devolve a mensagem de erro (ou vazio, se estiver certo).
const REGRAS = {
    nome: (v) => (v.trim().length >= 3 ? '' : 'Digite o seu nome.'),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Digite um e-mail válido, como nome@exemplo.com.'),
    telefone: (v) => (v === '' || /^\(\d{2}\) \d{4,5}-\d{4}$/.test(v) ? '' : 'Digite o telefone com DDD, como (35) 99999-0000.'),
    tipo: (v) => (v ? '' : 'Escolha o tipo de projeto.'),
    mensagem: (v) => (v.trim().length >= 10 ? '' : 'Escreva pelo menos uma frase.')
};

function validar(campo) {
    const mensagem = REGRAS[campo.name](campo.value);
    document.getElementById(`${campo.id}-erro`).textContent = mensagem;
    campo.setAttribute('aria-invalid', String(Boolean(mensagem)));
    return !mensagem;
}

function mascara(valor) {
    const d = valor.replace(/\D/g, '').slice(0, 11);
    if (d.length === 0) return '';
    if (d.length <= 2) return `(${d}`;
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

document.querySelectorAll('form[data-assunto]').forEach((form) => {
    const campos = [...form.elements].filter((el) => el.name in REGRAS);
    const status = form.querySelector('.status');

    if (form.elements.telefone) {
        form.elements.telefone.addEventListener('input', (e) => { e.target.value = mascara(e.target.value); });
    }

    form.addEventListener('focusout', (e) => { if (e.target.name in REGRAS) validar(e.target); });

    form.addEventListener('submit', (evento) => {
        evento.preventDefault();
        const invalidos = campos.filter((campo) => !validar(campo));
        if (invalidos.length > 0) {
            invalidos[0].focus();
            status.textContent = '';
            return;
        }

        const corpo = campos.map((campo) => `${campo.labels[0].firstChild.textContent.trim()}: ${campo.value}`).join('\n');
        const endereco = `mailto:${CONTATO.email}?subject=${encodeURIComponent(form.dataset.assunto)}&body=${encodeURIComponent(corpo)}`;
        status.textContent = `Abrimos o seu aplicativo de e-mail com a mensagem pronta. Se nada abrir, escreva para ${CONTATO.email}.`;
        window.location.href = endereco;
    });
});
