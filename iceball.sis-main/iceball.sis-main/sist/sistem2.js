// ===== EXPLICAÇÃO INICIAL =====
// Este JavaScript controla o sistema de fechamento da sorveteria
// Ele gerencia horários, validações e cálculos do dia

// ===== 1. VARIÁVEIS GLOBAIS - Informações que ficam guardadas durante toda a execução =====
// Dados do sistema que serão usados em várias funções
let dadosSistema = {
    horarioAbertura: '08:30',
    dataAbertura: '15/05/2025',
    totalVendas: 1250.00,
    totalDespesas: 320.00,
    funcionariosAutorizados: ['001', '002', '003', '004', '005'] // IDs válidos
};

// Lista de funcionários cadastrados (simulação de banco de dados)
let funcionarios = [
    { id: '001', nome: 'Ana Silva', cargo: 'Gerente' },
    { id: '002', nome: 'João Oliveira', cargo: 'Vendedor' },
    { id: '003', nome: 'Mariana Costa', cargo: 'Atendente' },
    { id: '004', nome: 'Pedro Santos', cargo: 'Caixa' },
    { id: '005', nome: 'Julia Ferreira', cargo: 'Supervisor' }
];

// ===== 2. FUNÇÃO PARA FORMATAR DINHEIRO =====
// Esta função pega um número e transforma em formato brasileiro (R$ 1.234,56)
function formatarDinheiro(valor) {
    return 'R$ ' + valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2, // Sempre mostra 2 casas decimais
        maximumFractionDigits: 2
    });
}

// ===== 3. FUNÇÃO PARA PEGAR DATA E HORA ATUAL =====
function obterDataHoraAtual() {
    const agora = new Date(); // Cria objeto com data/hora atual
    
    // Extrai cada parte da data/hora
    const horas = agora.getHours().toString().padStart(2, '0');     // Adiciona zero à esquerda se necessário
    const minutos = agora.getMinutes().toString().padStart(2, '0');
    const dia = agora.getDate().toString().padStart(2, '0');
    const mes = (agora.getMonth() + 1).toString().padStart(2, '0'); // +1 porque Janeiro = 0
    const ano = agora.getFullYear();
    
    // Retorna objeto com as informações formatadas
    return {
        horario: `${horas}:${minutos}`,
        data: `${dia}/${mes}/${ano}`,
        completo: `${horas}:${minutos} - ${dia}/${mes}/${ano}`
    };
}

// ===== 4. FUNÇÃO PARA CALCULAR TEMPO DE FUNCIONAMENTO =====
function calcularTempoFuncionamento() {
    // Pega horário atual
    const horaAtual = obterDataHoraAtual();
    
    // Simula cálculo de tempo (em um sistema real, você salvaria o horário de abertura)
    const abertura = dadosSistema.horarioAbertura.split(':');
    const agora = horaAtual.horario.split(':');
    
    // Converte para minutos para fazer o cálculo
    const minutosAbertura = parseInt(abertura[0]) * 60 + parseInt(abertura[1]);
    const minutosAgora = parseInt(agora[0]) * 60 + parseInt(agora[1]);
    
    // Calcula diferença
    const diferenca = minutosAgora - minutosAbertura;
    const horasFuncionamento = Math.floor(diferenca / 60);
    const minutosRestantes = diferenca % 60;
    
    return `${horasFuncionamento}h ${minutosRestantes}min`;
}

// ===== 5. FUNÇÃO PARA VALIDAR ID DO FUNCIONÁRIO =====
function validarFuncionario(id) {
    // Verifica se o ID está na lista de funcionários autorizados
    return dadosSistema.funcionariosAutorizados.includes(id);
}

// ===== 6. FUNÇÃO PARA BUSCAR DADOS DO FUNCIONÁRIO =====
function buscarFuncionario(id) {
    // Procura o funcionário na lista pelo ID
    for (let i = 0; i < funcionarios.length; i++) {
        if (funcionarios[i].id === id) {
            return funcionarios[i]; // Retorna os dados do funcionário
        }
    }
    return null; // Retorna null se não encontrar
}

// ===== 7. FUNÇÃO PARA ATUALIZAR HORÁRIO DE FECHAMENTO =====
function atualizarHorarioFechamento() {
    console.log('Atualizando horário de fechamento...'); // Mensagem para debug
    
    // Pega a data e hora atual
    const horaAtual = obterDataHoraAtual();
    
    // Encontra o elemento no HTML e atualiza o texto
    const elementoHorario = document.getElementById('horario-fechamento');
    if (elementoHorario) {
        elementoHorario.textContent = horaAtual.completo;
        console.log('Horário atualizado para:', horaAtual.completo);
    }
}

// ===== 8. FUNÇÃO PARA ATUALIZAR RESUMO DO DIA =====
function atualizarResumo() {
    console.log('Atualizando resumo do dia...');
    
    // Calcula o saldo (receitas - despesas)
    const saldo = dadosSistema.totalVendas - dadosSistema.totalDespesas;
    
    // Busca os elementos na página e atualiza os valores
    const elementoVendas = document.querySelector('.resumo-item:nth-child(3) span');
    const elementoDespesas = document.querySelector('.resumo-item:nth-child(4) span');
    const elementoSaldo = document.querySelector('.resumo-saldo');
    
    if (elementoVendas) {
        elementoVendas.textContent = formatarDinheiro(dadosSistema.totalVendas);
    }
    
    if (elementoDespesas) {
        elementoDespesas.textContent = formatarDinheiro(dadosSistema.totalDespesas);
    }
    
    if (elementoSaldo) {
        elementoSaldo.textContent = `Saldo Diário: ${formatarDinheiro(saldo)}`;
        
        // Muda a cor baseado no saldo
        if (saldo > 0) {
            elementoSaldo.style.color = '#4CAF50'; // Verde para lucro
        } else if (saldo < 0) {
            elementoSaldo.style.color = '#F44336'; // Vermelho para prejuízo
        } else {
            elementoSaldo.style.color = '#FF9800'; // Laranja para empate
        }
    }
}

// ===== 9. FUNÇÃO PARA MOSTRAR INFORMAÇÕES DETALHADAS =====
function mostrarInformacoesDetalhadas() {
    const tempoFuncionamento = calcularTempoFuncionamento();
    const saldo = dadosSistema.totalVendas - dadosSistema.totalDespesas;
    
    // Cria uma mensagem detalhada
    const mensagem = `
🏪 RELATÓRIO DO DIA 🏪
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 Data: ${dadosSistema.dataAbertura}
⏰ Tempo de Funcionamento: ${tempoFuncionamento}
💰 Total de Vendas: ${formatarDinheiro(dadosSistema.totalVendas)}
💸 Total de Despesas: ${formatarDinheiro(dadosSistema.totalDespesas)}
💵 Saldo Final: ${formatarDinheiro(saldo)}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;
    
    // Mostra a mensagem (em um sistema real, isso seria salvo em arquivo/banco)
    alert(mensagem);
}

// ===== 10. FUNÇÃO PRINCIPAL DE FECHAMENTO =====
function fecharSistema() {
    console.log('Iniciando processo de fechamento...');
    
    // Pega o ID digitado pelo usuário
    const campoId = document.getElementById('funcionario-id');
    const idFuncionario = campoId.value.trim(); // trim() remove espaços em branco
    
    // VALIDAÇÃO 1: Verifica se o campo está vazio
    if (idFuncionario === '') {
        alert('❌ Por favor, insira o ID do funcionário para fechar o sistema!');
        campoId.focus(); // Coloca o cursor no campo
        return; // Para a execução da função
    }
    
    // VALIDAÇÃO 2: Verifica se o ID tem o formato correto (3 dígitos)
    if (idFuncionario.length !== 3 || isNaN(idFuncionario)) {
        alert('❌ ID inválido! O ID deve ter exatamente 3 dígitos numéricos.');
        campoId.focus();
        return;
    }
    
    // VALIDAÇÃO 3: Verifica se o funcionário está autorizado
    if (!validarFuncionario(idFuncionario)) {
        alert('❌ Funcionário não autorizado para fechar o sistema!');
        campoId.focus();
        return;
    }
    
    // Busca os dados do funcionário
    const funcionario = buscarFuncionario(idFuncionario);
    
    if (funcionario) {
        // Mostra confirmação
        const confirmar = confirm(
            `Confirmar fechamento do sistema?\n\n` +
            `👤 Funcionário: ${funcionario.nome}\n` +
            `💼 Cargo: ${funcionario.cargo}\n` +
            `🆔 ID: ${funcionario.id}\n\n` +
            `Clique em OK para confirmar.`
        );
        
        if (confirmar) {
            // Executa o fechamento
            executarFechamento(funcionario);
        }
    } else {
        alert('❌ Erro ao buscar dados do funcionário!');
    }
}

// ===== 11. FUNÇÃO PARA EXECUTAR O FECHAMENTO =====
function executarFechamento(funcionario) {
    console.log('Executando fechamento do sistema...');
    
    // Simula salvamento dos dados (em um sistema real, enviaria para servidor)
    const dadosFechamento = {
        funcionario: funcionario,
        horarioFechamento: obterDataHoraAtual().completo,
        vendas: dadosSistema.totalVendas,
        despesas: dadosSistema.totalDespesas,
        saldo: dadosSistema.totalVendas - dadosSistema.totalDespesas,
        tempoFuncionamento: calcularTempoFuncionamento()
    };
    
    // Mostra informações detalhadas
    mostrarInformacoesDetalhadas();
    
    // Mensagem de sucesso
    alert(
        `✅ Sistema fechado com sucesso!\n\n` +
        `👤 Responsável: ${funcionario.nome}\n` +
        `⏰ Fechado às: ${dadosFechamento.horarioFechamento}\n\n` +
        `Obrigado e até amanhã! 🍦`
    );
    
    // Simula log do sistema
    console.log('Dados do fechamento:', dadosFechamento);
    
    // Em um sistema real, aqui você redirecionaria para a página de login
    // window.location.href = 'claudelogin.html';
}

// ===== 12. FUNÇÃO PARA ADICIONAR EFEITOS VISUAIS =====
function adicionarEfeitosVisuais() {
    // Efeito de hover no campo de ID
    const campoId = document.getElementById('funcionario-id');
    
    if (campoId) {
        // Quando o usuário clica no campo
        campoId.addEventListener('focus', function() {
            this.style.borderColor = '#ff69b4';
            this.style.boxShadow = '0 0 10px rgba(255, 105, 180, 0.3)';
        });
        
        // Quando o usuário sai do campo
        campoId.addEventListener('blur', function() {
            this.style.borderColor = '#fdb4ce';
            this.style.boxShadow = 'none';
        });
        
        // Quando o usuário digita
        campoId.addEventListener('input', function() {
            // Permite apenas números
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Limita a 3 dígitos
            if (this.value.length > 3) {
                this.value = this.value.slice(0, 3);
            }
        });
    }
}

// ===== 13. FUNÇÃO PARA ATUALIZAR HORÁRIO AUTOMATICAMENTE =====
function iniciarAtualizacaoAutomatica() {
    // Atualiza o horário a cada 30 segundos
    setInterval(function() {
        atualizarHorarioFechamento();
        console.log('Horário atualizado automaticamente');
    }, 30000); // 30000 milissegundos = 30 segundos
}

// ===== 14. FUNÇÃO PRINCIPAL DE INICIALIZAÇÃO =====
function inicializar() {
    console.log('🚀 Sistema de fechamento iniciado!');
    
    // Atualiza informações da página
    atualizarHorarioFechamento();
    atualizarResumo();
    
    // Adiciona efeitos visuais
    adicionarEfeitosVisuais();
    
    // Inicia atualização automática do horário
    iniciarAtualizacaoAutomatica();
    
    // Adiciona evento ao botão de fechar
    const botaoFechar = document.querySelector('.btn-fechar');
    if (botaoFechar) {
        // Remove o link padrão e adiciona nossa função personalizada
        botaoFechar.addEventListener('click', function(evento) {
            evento.preventDefault(); // Impede o link de funcionar
            fecharSistema(); // Chama nossa função de fechamento
        });
    }
    
    // Adiciona evento para tecla Enter no campo de ID
    const campoId = document.getElementById('funcionario-id');
    if (campoId) {
        campoId.addEventListener('keypress', function(evento) {
            // Se o usuário pressionar Enter, executa o fechamento
            if (evento.key === 'Enter') {
                fecharSistema();
            }
        });
    }
    
    console.log('✅ Sistema configurado e pronto para uso!');
}

// ===== 15. FUNÇÃO PARA SIMULAR DADOS ALEATÓRIOS (DEMONSTRAÇÃO) =====
function simularDadosAleatorios() {
    // Gera valores aleatórios para demonstração
    dadosSistema.totalVendas = Math.random() * 2000 + 500;  // Entre 500 e 2500
    dadosSistema.totalDespesas = Math.random() * 800 + 200; // Entre 200 e 1000
    
    // Atualiza a exibição
    atualizarResumo();
    
    console.log('Dados aleatórios gerados para demonstração');
}

// ===== 16. EXECUÇÃO QUANDO A PÁGINA CARREGAR =====
// Quando o HTML estiver completamente carregado, executa a inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Página carregada, iniciando sistema...');
    inicializar();
});

// Também executa quando a janela carregar (compatibilidade)
window.addEventListener('load', function() {
    console.log('🪟 Janela carregada completamente');
});

// ===== 17. FUNÇÃO DE TESTE PARA DESENVOLVEDORES =====
function testarSistema() {
    console.log('🧪 Executando testes do sistema...');
    
    // Testa formatação de dinheiro
    console.log('Teste formatação:', formatarDinheiro(1234.56));
    
    // Testa validação de funcionário
    console.log('Teste validação (001):', validarFuncionario('001'));
    console.log('Teste validação (999):', validarFuncionario('999'));
    
    // Testa busca de funcionário
    console.log('Teste busca funcionário:', buscarFuncionario('001'));
    
    console.log('✅ Testes concluídos!');
}

// ===== FIM DO CÓDIGO =====
// Para testar o sistema, abra o console do navegador (F12) e digite: testarSistema()