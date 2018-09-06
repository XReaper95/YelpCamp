var processResponse = {
    processResponse: function (response) {
        if (response.output.action === 'display_date') this.processDate(response);
        else if (response.output.action === 'display_week_day') this.processDay(response);
    },

    processDate: function (response) {
        let data = response.context.currentDate;
        let mesesdoAno = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
        let dia = data.substring(0, 2);
        let mes = data.substring(2, 4);
        mes = mesesdoAno[Number(mes) - 1];
        let ano = data.substring(4);
        if (dia[0] == 0) dia = dia[1];

        response.output.text = `Hoje é ${dia} de ${mes} de ${ano}`;
    },

    processDay: function(response){
       let data = response.context.weekDay;     
       let diasSemana = ["Segunda","Terça","Quarta","Quinta","Sexta","Sábado","Domingão"];

       response.output.text = `Hoje é ${diasSemana[data-1]}`;
    }

}

module.exports = processResponse;