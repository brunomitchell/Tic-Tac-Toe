// Variáveis iniciais
let quadro = {
    a1: '', a2: '', a3: '',
    b1: '', b2: '', b3: '',
    c1: '', c2: '', c3: ''
};
let playing = false; // Verificação se o jogo está ativo
let vez = 'x'; // Quem começa
let warning = '';
let playerScore = 0;
let aiScore = 0;
let tieScore = 0;
let isSoundOn = true; // Estado inicial do som
const backgroundMusic = document.getElementById('background-music');
const soundToggleBtn = document.querySelector('.sound-toggle');

backgroundMusic.play();

// Inicialização
reset();

// Eventos

soundToggleBtn.addEventListener('click', () => {
    isSoundOn = !isSoundOn;
    if (isSoundOn) {
        backgroundMusic.play();
        soundToggleBtn.innerHTML = '🔊 Som Ativado'; // Texto do botão
    } else {
        backgroundMusic.pause();
        soundToggleBtn.innerHTML = '🔇 Som Desativado'; // Texto do botão
    }
});

document.querySelector('.reset').addEventListener('click', reset);

document.querySelectorAll('.item').forEach((item) => {
    item.addEventListener('click', (e) => {
        let loc = e.target.getAttribute('data-item');

        if (playing && quadro[loc] === '' && vez === 'x') {
            quadro[loc] = vez;
            renderQuadro();
            togglePlayer();
            setTimeout(aiPlay, 500); // IA joga após 500 ms
        }
    });
});

// Funções principais
function reset() {
    console.log("Iniciando novo jogo..."); // Depuração
    warning = '';
    playing = true; // Define como ativo para iniciar o jogo

    // Determina aleatoriamente quem começa
    let random = Math.floor(Math.random() * 2);
    vez = random === 0 ? 'x' : 'o';

    // Limpa o quadro
    for (let i in quadro) {
        quadro[i] = '';
    }

    // Limpa o fundo da área
    const area = document.querySelector('.area');
    area.style.backgroundColor = 'rgba(0, 0, 0, 0.8)'; // Restaura a cor inicial

    // Renderiza tudo e inicia o jogo
    renderQuadro();
    renderInfo();

    console.log("Vez inicial: ", vez); // Depuração

    // Se a IA for escolhida para começar, faz a jogada inicial dela
    if (vez === 'o') {
        setTimeout(aiPlay, 500);
    }
}

function renderQuadro() {
    for (let i in quadro) {
        let item = document.querySelector(`div[data-item=${i}]`);
        item.innerHTML = quadro[i] !== '' ? quadro[i] : '';
    }
    checkGame();
}

function renderInfo() {
    document.querySelector('.vez').innerHTML = vez;
    document.querySelector('.resultado').innerHTML = warning;
}

function renderScore() {
    document.querySelector('.player-score').innerHTML = playerScore;
    document.querySelector('.ai-score').innerHTML = aiScore;
    document.querySelector('.tie-score').innerHTML = tieScore;
}

function togglePlayer() {
    vez = vez === 'x' ? 'o' : 'x';
    renderInfo();
}

function checkGame() {
    if (checkWinnerFor('x')) {
        warning = 'Você venceu!';
        playerScore++; // Incrementa o placar do jogador
        playing = false;
        setBackgroundByResult('vitoria-jogador');
    } else if (checkWinnerFor('o')) {
        warning = 'A IA venceu';
        aiScore++; // Incrementa o placar da IA
        playing = false;
        setBackgroundByResult('vitoria-ia');
    } else if (isFull()) {
        warning = 'Deu empate';
        tieScore++; // Incrementa o placar de empate
        playing = false;
        setBackgroundByResult('empate');
    }

    renderInfo();
    renderScore(); // Atualiza o placar após cada partida
}

function checkWinnerFor(i) {
    let pos = [
        'a1,a2,a3',
        'b1,b2,b3',
        'c1,c2,c3',
        'a1,b1,c1',
        'a2,b2,c2',
        'a3,b3,c3',
        'a1,b2,c3',
        'a3,b2,c1'
    ];

    for (let w in pos) {
        let pArray = pos[w].split(',');
        let hasWon = pArray.every(option => quadro[option] === i);
        if (hasWon) return true;
    }

    return false;
}

function isFull() {
    return Object.values(quadro).every(value => value !== '');
}

// Função da IA para jogar
function aiPlay() {
    if (vez === 'o' && playing) {
        let move = findBestMove('o') || findBestMove('x') || randomMove();
        if (move) {
            quadro[move] = 'o';
            renderQuadro();
            togglePlayer();
        }
    }
}

// Função para buscar a melhor jogada
function findBestMove(player) {
    let pos = [
        'a1,a2,a3',
        'b1,b2,b3',
        'c1,c2,c3',
        'a1,b1,c1',
        'a2,b2,c2',
        'a3,b3,c3',
        'a1,b2,c3',
        'a3,b2,c1'
    ];

    for (let w in pos) {
        let pArray = pos[w].split(',');
        let countPlayer = pArray.filter(option => quadro[option] === player).length;
        let countEmpty = pArray.filter(option => quadro[option] === '').length;

        if (countPlayer === 2 && countEmpty === 1) {
            return pArray.find(option => quadro[option] === '');
        }
    }
    return null;
}

// Função para escolher uma jogada aleatória
function randomMove() {
    let emptySpots = Object.keys(quadro).filter(key => quadro[key] === '');
    return emptySpots.length > 0 ? emptySpots[Math.floor(Math.random() * emptySpots.length)] : null;
}

function setBackgroundByResult(resultado) {
    const area = document.querySelector('.area'); // Seleciona a área do jogo
    area.classList.remove('vitoria-jogador', 'vitoria-ia', 'empate'); // Remove classes anteriores

    if (resultado === 'vitoria-jogador') {
        area.style.backgroundColor = 'rgba(0, 255, 0, 0.5)'; // Verde com transparência
    } else if (resultado === 'vitoria-ia') {
        area.style.backgroundColor = 'rgba(255, 0, 0, 0.5)'; // Vermelho com transparência
    } else if (resultado === 'empate') {
        area.style.backgroundColor = 'rgba(255, 255, 0, 0.5)'; // Amarelo com transparência
    }
}

