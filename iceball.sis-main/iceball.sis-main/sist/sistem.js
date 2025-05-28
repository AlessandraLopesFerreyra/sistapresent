// ===== EXPLICAÇÃO INICIAL =====
// JavaScript é uma linguagem que roda no navegador e permite que as páginas sejam interativas
// Vamos criar um sistema simples para controlar movimentos financeiros

// ===== 1. VARIÁVEIS - São como caixas que guardam informações =====
// Array (lista) para guardar todos os movimentos financeiros
let movimentos = [];

// Variáveis para controlar os totais
let totalReceitas = 0;
let totalDespesas = 0;
let saldo = 0;

// ===== 2. FUNÇÃO PARA PEGAR ELEMENTOS DA PÁGINA =====
// document.getElementById() busca um elemento pelo seu ID no HTML
function obterElementos() {
    return {
        // Elementos do formulário
        formulario: document.querySelector('form'),
        tipoMovimento: document.getElementById('tipoMovimento'),
        categoriaMovimento: document.getElementById('categoriaMovimento'),
        dataMovimento: document.getElementById('dataMovimento'),
        valorMovimento: document.getElementById('valorMovimento'),
        responsavelMovimento: document.getElementById('responsavelMovimento'),
        descricaoMovimento: document.getElementById('descricaoMovimento'),
        
        // Elementos da tabela e totais
        tabelaCorpo: document.querySelector('.data-table tbody'),
        totalReceitasEl: document.querySelector('.total-receitas .value'),
        totalDespesasEl: document.querySelector('.total-despesas .value'),
        saldoEl: document.querySelector('.total-saldo .value'),
        
        // Elementos de filtro
        filtroMes: document.getElementById('filtroMes'),
        filtroAno: document.getElementById('filtroAno'),
        filtroTipo: document.getElementById('filtroTipo'),
        botaoFiltrar: document.querySelector('.filter-btn')
    };
}

// ===== 3. FUNÇÃO PARA FORMATAR VALOR EM REAIS =====
function formatarMoeda(valor) {
    // Converte número para formato brasileiro (R$ 1.234,56)
    return 'R$ ' + valor.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// ===== 4. FUNÇÃO PARA CONVERTER TEXTO EM NÚMERO =====
function converterParaNumero(valorTexto) {
    // Remove "R$", espaços e vírgulas, depois converte para número
    let numero = valorTexto.replace(/[R$\s]/g, '').replace(',', '.');
    return parseFloat(numero) || 0; // Se não conseguir converter, retorna 0
}

// ===== 5. FUNÇÃO PARA ADICIONAR MOVIMENTO =====
function adicionarMovimento(evento) {
    // preventDefault() impede que a página recarregue quando o formulário for enviado
    evento.preventDefault();
    
    // Pega os elementos da página
    const elementos = obterElementos();
    
    // Pega os valores dos campos do formulário
    const tipo = elementos.tipoMovimento.value;
    const categoria = elementos.categoriaMovimento.value;
    const data = elementos.dataMovimento.value;
    const valorTexto = elementos.valorMovimento.value;
    const responsavel = elementos.responsavelMovimento.value;
    const descricao = elementos.descricaoMovimento.value;
    
    // Validação - verifica se todos os campos obrigatórios estão preenchidos
    if (!tipo || !categoria || !data || !valorTexto || !responsavel) {
        alert('Por favor, preencha todos os campos obrigatórios!');
        return; // Para a execução da função
    }
    
    // Converte o valor para número
    const valor = converterParaNumero(valorTexto);
    
    if (valor <= 0) {
        alert('Por favor, insira um valor válido maior que zero!');
        return;
    }
    
    // Cria um objeto com os dados do movimento
    const novoMovimento = {
        id: Date.now(), // Usa timestamp como ID único
        tipo: tipo,
        categoria: categoria,
        data: data,
        valor: valor,
        responsavel: responsavel,
        descricao: descricao
    };
    
    // Adiciona o movimento ao array
    movimentos.push(novoMovimento);
    
    // Atualiza a exibição
    atualizarTabela();
    calcularTotais();
    
    // Limpa o formulário
    elementos.formulario.reset();
    elementos.valorMovimento.value = 'R$ 0,00';
    
    alert('Movimento adicionado com sucesso!');
}

// ===== 6. FUNÇÃO PARA CALCULAR TOTAIS =====
function calcularTotais() {
    // Reinicia os totais
    totalReceitas = 0;
    totalDespesas = 0;
    
    // Percorre todos os movimentos e soma os valores
    for (let i = 0; i < movimentos.length; i++) {
        const movimento = movimentos[i];
        
        if (movimento.tipo === 'receita') {
            totalReceitas += movimento.valor;
        } else if (movimento.tipo === 'despesa') {
            totalDespesas += movimento.valor;
        }
    }
    
    // Calcula o saldo (receitas - despesas)
    saldo = totalReceitas - totalDespesas;
    
    // Atualiza os elementos na tela
    const elementos = obterElementos();
    elementos.totalReceitasEl.textContent = formatarMoeda(totalReceitas);
    elementos.totalDespesasEl.textContent = formatarMoeda(totalDespesas);
    elementos.saldoEl.textContent = formatarMoeda(saldo);
    
    // Muda a cor do saldo baseado no valor
    if (saldo > 0) {
        elementos.saldoEl.style.color = '#4CAF50'; // Verde para positivo
    } else if (saldo < 0) {
        elementos.saldoEl.style.color = '#F44336'; // Vermelho para negativo
    } else {
        elementos.saldoEl.style.color = '#333'; // Cinza para zero
    }
}

// ===== 7. FUNÇÃO PARA ATUALIZAR A TABELA =====
function atualizarTabela() {
    const elementos = obterElementos();
    const tbody = elementos.tabelaCorpo;
    
    // Limpa a tabela
    tbody.innerHTML = '';
    
    // Se não há movimentos, mostra mensagem
    if (movimentos.length === 0) {
        const linha = document.createElement('tr');
        linha.innerHTML = '<td colspan="6" style="text-align: center; padding: 20px;">Nenhum movimento encontrado</td>';
        tbody.appendChild(linha);
        return;
    }
    
    // Cria uma linha para cada movimento
    for (let i = 0; i < movimentos.length; i++) {
        const movimento = movimentos[i];
        
        // Cria nova linha da tabela
        const linha = document.createElement('tr');
        
        // Formatar data para exibição (de yyyy-mm-dd para dd/mm/yyyy)
        const dataFormatada = movimento.data.split('-').reverse().join('/');
        
        // Define o conteúdo da linha
        linha.innerHTML = `
            <td>${dataFormatada}</td>
            <td style="text-transform: capitalize;">${movimento.tipo}</td>
            <td style="text-transform: capitalize;">${movimento.categoria}</td>
            <td>${movimento.descricao}</td>
            <td>${movimento.responsavel}</td>
            <td class="${movimento.tipo}">${formatarMoeda(movimento.valor)}</td>
        `;
        
        // Adiciona a linha à tabela
        tbody.appendChild(linha);
    }
}

// ===== 8. FUNÇÃO PARA FILTRAR MOVIMENTOS =====
function filtrarMovimentos() {
    const elementos = obterElementos();
    
    // Pega os valores dos filtros
    const mesSelecionado = elementos.filtroMes.value;
    const anoSelecionado = elementos.filtroAno.value;
    const tipoSelecionado = elementos.filtroTipo.value;
    
    // Guarda todos os movimentos originais
    const movimentosOriginais = [...movimentos];
    
    // Filtra os movimentos baseado nos critérios
    let movimentosFiltrados = movimentosOriginais.filter(function(movimento) {
        const dataMovimento = new Date(movimento.data + 'T00:00:00');
        const mesMovimento = dataMovimento.getMonth() + 1; // +1 porque getMonth() retorna 0-11
        const anoMovimento = dataMovimento.getFullYear();
        
        // Verifica cada filtro
        let passaMes = (mesSelecionado === 'todos') || (mesMovimento == mesSelecionado);
        let passaAno = (anoMovimento == anoSelecionado);
        let passaTipo = (tipoSelecionado === 'todos') || (movimento.tipo === tipoSelecionado);
        
        // Retorna true apenas se todos os filtros passarem
        return passaMes && passaAno && passaTipo;
    });
    
    // Substitui temporariamente o array de movimentos pelos filtrados
    const movimentosTemp = movimentos;
    movimentos = movimentosFiltrados;
    
    // Atualiza a exibição
    atualizarTabela();
    calcularTotais();
    
    // Restaura o array original
    movimentos = movimentosTemp;
}

// ===== 9. FUNÇÃO PARA FORMATAR CAMPO DE VALOR ENQUANTO DIGITA =====
function formatarCampoValor() {
    const elementos = obterElementos();
    const campo = elementos.valorMovimento;
    
    // Adiciona evento que dispara quando o usuário digita
    campo.addEventListener('input', function() {
        let valor = this.value;
        
        // Remove tudo que não é número
        valor = valor.replace(/[^\d]/g, '');
        
        // Se não há número, define como 0
        if (valor === '') {
            valor = '0';
        }
        
        // Converte para número e divide por 100 (para ter centavos)
        let numero = parseInt(valor) / 100;
        
        // Formata como moeda
        this.value = formatarMoeda(numero);
    });
}

// ===== 10. FUNÇÃO PRINCIPAL QUE INICIA TUDO =====
function inicializar() {
    console.log('Sistema iniciado!'); // Mostra mensagem no console do navegador
    
    const elementos = obterElementos();
    
    // Adiciona eventos aos elementos
    // addEventListener() "escuta" por eventos (clique, envio de formulário, etc.)
    
    // Quando o formulário for enviado, chama a função adicionarMovimento
    elementos.formulario.addEventListener('submit', adicionarMovimento);
    
    // Quando o botão filtrar for clicado, chama a função filtrarMovimentos
    elementos.botaoFiltrar.addEventListener('click', filtrarMovimentos);
    
    // Configura formatação do campo valor
    formatarCampoValor();
    
    // Exibe valores iniciais
    calcularTotais();
    atualizarTabela();
    
    // Adiciona alguns dados de exemplo para demonstração
    adicionarDadosExemplo();
}

// ===== 11. FUNÇÃO PARA ADICIONAR DADOS DE EXEMPLO =====
function adicionarDadosExemplo() {
    // Dados de exemplo para testar o sistema
   
    
    // Adiciona cada exemplo ao array de movimentos
    for (let i = 0; i < exemplos.length; i++) {
        movimentos.push(exemplos[i]);
    }
    
    // Atualiza a exibição
    atualizarTabela();
    calcularTotais();
}

// ===== 12. EXECUÇÃO QUANDO A PÁGINA CARREGAR =====
// DOMContentLoaded dispara quando todo o HTML foi carregado
document.addEventListener('DOMContentLoaded', inicializar);

// ===== FIM DO CÓDIGO =====