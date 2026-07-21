export const BlunderIcon = () => {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E81F1D] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    <filter id="blunder-shadow" x="-10%" y="-10%" width="130%" height="130%">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#7F1D1D" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>

                <text
                    x="50%"
                    y="54%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    fontSize="17"
                    fontWeight="1000"
                    fontFamily="System-UI, -apple-system, BlinkMacSystemFont, 'Arial Black', sans-serif"
                    filter="url(#blunder-shadow)"
                    letterSpacing="-0.5"
                >
                    ??
                </text>
            </svg>
        </div>
    );
};

export const BookIcon = () => {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BC9C7A] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    <filter id="book-shadow" x="-10%" y="-10%" width="130%" height="130%">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#59442E"
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>

                <g transform="translate(2.5, 2.5) scale(0.79)" filter="url(#book-shadow)">
                    <path
                        d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"
                        stroke="white"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        </div>
    );
};

export const BestMoveIcon = () => {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#76B843] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    <filter id="best-shadow" x="-10%" y="-10%" width="130%" height="130%">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#3B5D21" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>
                <g transform="translate(1.8, 2.1) scale(0.85)" filter="url(#best-shadow)">
                    <path
                        d="M12 2l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9z"
                        fill="white"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        </div>
    );
};

export const ExcellentMoveIcon = () => {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#76B843] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    <filter id="excellent-shadow" x="-10%" y="-10%" width="130%" height="130%">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#3B5D21" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>

                <g transform="translate(4, 2.3) scale(0.75)" filter="url(#excellent-shadow)">
                    <path
                        d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H0a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h7"
                        fill="white"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    <path 
                        d="M 3 11 L 3 21.3" 
                        stroke="#76B843" 
                        strokeWidth="3" 
                        strokeLinecap="square" 
                    />
                </g>
            </svg>
        </div>
    );
};

export const InaccuracyMoveIcon = () => {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4BB44] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    <filter id="inaccuracy-shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#8F6B1E" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>

                <text
                    x="50%"
                    y="53%"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    fill="white"
                    fontSize="18"
                    fontWeight="900"
                    fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
                    filter="url(#inaccuracy-shadow)"
                >
                    ?!
                </text>
            </svg>
        </div>
    );
};

export const GoodMoveIcon = () => {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#758f5e] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    <filter id="good-shadow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#4E6800" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>

                <g transform="translate(12, 12) scale(0.75)" filter="url(#good-shadow)">
                    <path
                        d="M8 -6L-3 5L-8 0"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        </div>
    );
};

export const MistakeMoveIcon = () => {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ffa358] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    {/* Sombra projetada adaptada para o fundo laranja para manter a profundidade */}
                    <filter id="mistake-shadow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#943d16" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>

                {/* O texto com o "?" posicionado e estilizado exatamente como o traço anterior */}
                <g filter="url(#mistake-shadow)">
                    <text
                        x="12"
                        y="18"
                        textAnchor="middle"
                        fill="white"
                        fontSize="17"
                        fontWeight="900"
                        fontFamily="sans-serif"
                    >
                        ?
                    </text>
                </g>
            </svg>
        </div>
    );
};

export const MissMoveIcon = () => {
    return (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ee6b55] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    {/* Sombra interna/projetada escura adaptada para o fundo vermelho */}
                    <filter id="miss-shadow" x="-30%" y="-30%" width="160%" height="160%">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#7d2929" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>

                {/* Linhas cruzadas para o ícone de 'X', centralizadas usando a mesma escala 0.75 */}
                <g transform="translate(12, 12) scale(0.75)" filter="url(#miss-shadow)">
                    <path
                        d="M-5 -5L5 5M5 -5L-5 5"
                        stroke="white"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        </div>
    );
};

export const MissedWinMoveIcon = () => {
    return (
        /* O círculo original foi restaurado exatamente como estava */
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F4BB44] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    {/* userSpaceOnUse impede que o filtro mude o tamanho ou suma com o traço */}
                    <filter id="svg-shadow" filterUnits="userSpaceOnUse">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#8F6B1E" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>
                <path
                    d="M5 12H19"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    /* Vincula o filtro corrigido */
                    filter="url(#svg-shadow)"
                />
            </svg>
        </div>
    );
};

export const ForcedMoveIcon = () => {
    return (
        /* Círculo com o fundo verde #758f5e */
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#758f5e] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    <filter id="forced-svg-shadow" filterUnits="userSpaceOnUse">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#4b5d3c" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>
                {/* Aumentamos a escala para 0.92 e ajustamos o translate para 1, 1 */}
                <g transform="translate(1.5, 1) scale(0.92)" filter="url(#forced-svg-shadow)">
                    <path
                        d="M5 9.5H13V5.5L19.5 12L13 18.5V14.5H5V9.5Z"
                        stroke="white"
                        strokeWidth="2.5"
                        fill="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        </div>
    );
};

export const CriticalMoveIcon = () => {
    return (
        /* Círculo com o fundo azul #6e94b7 */
        <div className="flex h-8 w-8 items-centerify-center rounded-full bg-[#6e94b7] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    <filter id="critical-svg-shadow" filterUnits="userSpaceOnUse">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#435c73" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>
                {/* Escala aumentada para 0.88 e o translate reposicionado para compensar */}
                <g transform="translate(3, 3) scale(0.88)" filter="url(#critical-svg-shadow)">
                    <path
                        d="M12 5C11.1 5 10.5 5.6 10.6 6.5L11.1 14C11.1 14.5 11.5 15 12 15C12.5 15 12.9 14.5 12.9 14L13.4 6.5C13.5 5.6 12.9 5 12 5ZM12 17C11.2 17 10.5 17.7 10.5 18.5C10.5 19.3 11.2 20 12 20C12.8 20 13.5 19.3 13.5 18.5C13.5 17.7 12.8 17 12 17Z"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        </div>
    );
};

export const BrilliantMoveIcon = () => {
    return (
        /* Círculo com o fundo ciano #17bbeb solicitado */
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#17bbeb] shadow-md select-none">
            <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://w3.org"
            >
                <defs>
                    {/* Filtro de sombra calibrado com um tom ciano-escuro de contraste */}
                    <filter id="brilliant-svg-shadow" filterUnits="userSpaceOnUse">
                        <feDropShadow 
                            dx="0.8" 
                            dy="1.5" 
                            stdDeviation="0" 
                            floodColor="#0d6d8a" 
                            floodOpacity="1" 
                        />
                    </filter>
                </defs>
                {/* 
                   O grupo aplica a escala 0.82 e o deslocamento 2.16 para manter 
                   o par de exclamações totalmente visível e centralizado.
                */}
                <g transform="translate(2.6, 2) scale(0.82)" filter="url(#brilliant-svg-shadow)">
                    {/* 
                       Vetor duplo (!!):
                       - O primeiro ponto está centralizado em X=9.5 (afastado para a esquerda).
                       - O segundo ponto está centralizado em X=14.5 (afastado para a direita).
                    */}
                    <path
                        d="M9.5 5C8.6 5 8 5.6 8.1 6.5L8.6 14C8.6 14.5 9 15 9.5 15C10 15 10.4 14.5 10.4 14L10.9 6.5C11 5.6 10.4 5 9.5 5ZM9.5 17C8.7 17 8 17.7 8 18.5C8 19.3 8.7 20 9.5 20C10.3 20 11 19.3 11 18.5C11 17.7 10.3 17 9.5 17ZM14.5 5C13.6 5 13 5.6 13.1 6.5L13.6 14C13.6 14.5 14 15 14.5 15C15 15 15.4 14.5 15.4 14L15.9 6.5C16 5.6 15.4 5 14.5 5ZM14.5 17C13.7 17 13 17.7 13 18.5C13 19.3 13.7 20 14.5 20C15.3 20 16 19.3 16 18.5C16 17.7 15.3 17 14.5 17Z"
                        stroke="white"
                        strokeWidth="1.5"
                        fill="white"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </g>
            </svg>
        </div>
    );
};























