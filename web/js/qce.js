/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


function drawQCE(respList,jFrame){
    quantEntregas = 5;
    quantResponsaveis = 5;
    frame  = jFrame;
    qce = $("<table id=qce></table>").appendTo(mainFrame);
    introRow = $("<tr id='introrow' class='thinRow'><td rowspan=2 class='responsavel' id='responsavel'>Responsaveis</td><td colspan='"+quantEntregas+"'>entregas</td>").appendTo(qce);
    entregasRow = $("<tr class='thinRow' id='entregasRow'></tr>").appendTo(qce);
    fillEntregas(quantEntregas);
    var responsaveisRow = new Array();
    fillResponsaveis(responsaveisRow,respList);
    
  //  $("#qce.td").
//    
//    var cel = new Array();
//    for (i=1;i<5;i++){
//        row[i] = $("<tr></tr>").appendTo(qce);
//        for (j=1;j<3;j++){
//             cel[j] = $("<td>celula"+i+","+j+"</td>").appendTo(row);
//    }
//    }
//    cel[1].attr("rowspan","2");
//    row[1].prepend("<td rowspan='2'>oi</td>");
}

function fillEntregas(n){
    for(i=1;i<(n+1);i++){
        $("#entregasRow").append($("<td>entrega"+i+"</td>"));
    }
};
function fillResponsaveis(responsaveisRow,respList){
      
      for(resp in respList){
          responsaveisRow[i] = $("<tr id='responsavelrow"+i+"' class='fatRow'><td class='responsavel' id='responsavelCell"+i+"'>"+ respList[resp]  +"</td></tr>");
          $("#qce").append(responsaveisRow[i]);
}
};