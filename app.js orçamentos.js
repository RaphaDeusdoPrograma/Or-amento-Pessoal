document.addEventListener('DOMContentLoaded', () => {
    // Obtém referências aos elementos HTML relevantes
    const form = document.getElementById('form');
    const tipo = document.getElementById('tipo');
    const descricao = document.getElementById('descricao');
    const valor = document.getElementById('valor');
    const receitasTabela = document.getElementById('receitas-tabela');
    const despesasTabela = document.getElementById('despesas-tabela');
    const saldoElement = document.getElementById('saldo');
    const reiniciarBtn = document.getElementById('reiniciar');

    // Função para carregar os dados do localStorage e atualizar a interface
    function carregarDados() {
        // Carrega o saldo total do localStorage ou solicita ao usuário
        let saldoTotal = parseFloat(localStorage.getItem('saldoTotal'));
        if (isNaN(saldoTotal) || saldoTotal === null) {
            saldoTotal = parseFloat(prompt('Digite o saldo total:'));
            if (!isNaN(saldoTotal)) {
                localStorage.setItem('saldoTotal', saldoTotal);
            }
        }

        // Exibe o saldo total na interface
        saldoElement.textContent = saldoTotal.toFixed(2);

        // Carrega as transações
        const transacoesSalvas = JSON.parse(localStorage.getItem('transacoes')) || [];
        transacoesSalvas.forEach(transacao => {
            adicionarTransacaoDOM(transacao);
        });
    }

    // Função para salvar uma transação no localStorage
    function salvarTransacao(transacao) {
        const transacoesSalvas = JSON.parse(localStorage.getItem('transacoes')) || [];
        transacoesSalvas.push(transacao);
        localStorage.setItem('transacoes', JSON.stringify(transacoesSalvas));
    }

    // Função para adicionar uma transação à lista no DOM e à tabela correspondente
    function adicionarTransacaoDOM(transacao) {
        const item = document.createElement('li');
        item.textContent = `${transacao.descricao}: R$ ${transacao.valor.toFixed(2)}`;
        if (transacao.tipo === 'receita') {
            receitasTabela.appendChild(item);
        } else {
            despesasTabela.appendChild(item);
        }

        // Atualiza o saldo total automaticamente
        let saldoTotal = parseFloat(localStorage.getItem('saldoTotal'));
        if (transacao.tipo === 'receita') {
            saldoTotal += transacao.valor;
        } else {
            saldoTotal -= transacao.valor;
        }
        localStorage.setItem('saldoTotal', saldoTotal);
        saldoElement.textContent = saldoTotal.toFixed(2);
    }

    // Função para calcular a renda mensal e reiniciar as transações no final de cada mês
    function calcularRendaMensal() {
        // Seu código para calcular renda mensal aqui
    }

    // Função para perguntar o saldo total
    function perguntarSaldoTotal() {
        let saldoTotal = parseFloat(prompt('Digite o saldo total:'));
        if (!isNaN(saldoTotal)) {
            localStorage.setItem('saldoTotal', saldoTotal);
            saldoElement.textContent = saldoTotal.toFixed(2);
        }
    }

    // Inicializa os dados
    carregarDados();

    // Calcula a renda mensal e reinicia as transações no final de cada mês
    calcularRendaMensal();

    // Adiciona um ouvinte de evento para o formulário de transações
    form.addEventListener('submit', (e) => {
        // Previne o comportamento padrão do envio do formulário
        e.preventDefault();

        // Obtém os valores dos campos do formulário
        const tipoTransacao = tipo.value;
        const descricaoTransacao = descricao.value;
        const valorTransacao = parseFloat(valor.value);

        // Verifica se os campos estão preenchidos e se o valor é válido
        if (tipoTransacao && descricaoTransacao && valorTransacao && !isNaN(valorTransacao) && valorTransacao > 0) {
            // Salva a transação
            const transacao = {
                tipo: tipoTransacao,
                descricao: descricaoTransacao,
                valor: valorTransacao
            };
            salvarTransacao(transacao);

            // Adiciona a transação à lista no DOM e à tabela correspondente
            adicionarTransacaoDOM(transacao);

            // Limpa os campos do formulário após adicionar a transação
            descricao.value = '';
            valor.value = '';
        } else {
            // Exibe mensagens de erro específicas ou um alerta genérico
            alert('Por favor, preencha todos os campos corretamente.');
        }
    });

    // Adiciona um ouvinte de evento ao botão de reiniciar
    reiniciarBtn.addEventListener('click', () => {
        if (confirm('Tem certeza que deseja reiniciar? Isso limpará todas as transações e o saldo total.')) {
            localStorage.clear();
            location.reload(); // Recarrega a página
        }
    });

    // Adiciona um ouvinte de evento ao evento beforeunload do window para exibir um prompt personalizado ao sair do site
    window.addEventListener('beforeunload', (event) => {
        // Define a mensagem a ser exibida no prompt
        const confirmationMessage = 'Tem certeza que deseja sair do site?';
        event.returnValue = confirmationMessage;
        return confirmationMessage;
    });
});
