const baseUrl = "http://localhost:3000/paletas";

async function findAllPaletas() {
	const response = await fetch(`${baseUrl}/find-paletas`);

	const paletas = await response.json();

	if (paletas.types == 'erro') {
		mensagem(paletas.message, 'erro');
	}

	paletas.forEach((paleta) => {
		document.getElementById('contentList').insertAdjacentHTML(
			'beforeend',
			`<div class="paletaItem" id="paletaItem_${paleta.id}">
        <div>
            <div class="paletaItem__sabor">${paleta.sabor}</div>
            <div class="paletaItem__preco">R$ ${paleta.preco}</div>
            <div class="paletaItem__descricao">${paleta.descricao}</div>
            <div class="paletaItem__acoes">
              <div class="acoes">
                <button class="acoes__editar btn" onclick="abrirModal(${
									paleta.id
								})">Editar</button> 
                <button class="acoes__apagar btn" onclick="abrirModalDelete(${
									paleta.id
								})">Apagar</button> 
              </div>
            </div>
        </div>
            <img class="paletaItem__img" src=${
							paleta.foto
						} alt=${`Paleta de ${paleta.sabor}`} />
            
      </div>`
		);
	});
}

findAllPaletas();

const findPaletaById = async () => {
	const id = document.getElementById('idPaleta').value;

	console.log(id);

	if (id <= 0) {
		mensagem('Digite um numero válido!', 'erro');
	}
	document.querySelector('.modal-overlay1').style.display = 'flex';

	const response = await fetch(`${baseUrl}/find-paleta/${id}`);

	const paleta = await response.json();

	if (paleta.id == undefined) {
		const paletaEscolhidaDiv = document.getElementById('paletaEscolhida');
		paletaEscolhidaDiv.innerHTML = `<div class="paletaItem">
    <div>
        <div class="paletaItem__sabor">Paleta não encontrada</div>
    </div>`;
		mensagem('Digite um numero válido!', 'erro');
	} else {
		const paletaEscolhidaDiv = document.getElementById('paletaEscolhida');

		paletaEscolhidaDiv.innerHTML = `
    <div class="paletaItem" id="paletaItem_${paleta.id}">
      <div>
          <div class="paletaItem__sabor">${paleta.sabor}</div>
          <div class="paletaItem__preco">R$ ${paleta.preco}</div>
          <div class="paletaItem__descricao">${paleta.descricao}</div>
        </div>
          <img class="paletaItem__img" src=${
						paleta.foto
					} alt=${`Paleta de ${paleta.sabor}`} />
    </div>`;
	}
};

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";
  document.querySelector(".modal-overlay1").style.display = "none";
  document.querySelector("#overlay-delete").style.display = "none";
  document.querySelector("#modal-alert").style.display = "none";
  document.querySelector("#sabor").value = "";
  document.querySelector("#preco").value = 0;
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

async function abrirModal(id = null) {
  if(id != null){
    document.querySelector("#title-modal").innerText = "Editar uma paleta";
    
    document.querySelector("#button-modal").innerText = "Atualizar";

    const response = await fetch(`${baseUrl}/find-paleta/${id}`);

    const paleta = await response.json();

    document.querySelector("#id").value = paleta.id;
    document.querySelector("#sabor").value = paleta.sabor;
    document.querySelector("#preco").value = paleta.preco;
    document.querySelector("#descricao").value = paleta.descricao;
    document.querySelector("#foto").value = paleta.foto;

  }else{
    document.querySelector("#title-modal").innerText = "Cadastrar uma paleta";
    document.querySelector("#button-modal").innerText = "Cadastrar";
  }
  document.querySelector(".modal-overlay").style.display = "flex";
}

async function createPaleta() {

  const id = document.querySelector("#id").value;
  const sabor = document.querySelector("#sabor").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;

  const paleta = {
    id,
    sabor,
    preco,
    descricao,
    foto,
  };

  const modoEdicao = id > 0;

  const endpoint = baseUrl + (modoEdicao ? `/update/${id}` : '/create');

  const response = await fetch(endpoint, {
    method: modoEdicao ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const novaPaleta = await response.json();

  const html = `
  <div class="paletaItem" id="paletaItem_${paleta.id}">
    <div>
        <div class="paletaItem__sabor">${novaPaleta.sabor}</div>
        <div class="paletaItem__preco">R$ ${novaPaleta.preco}</div>
        <div class="paletaItem__descricao">${novaPaleta.descricao}</div>
        <div class="paletaItem__acoes">
              <div class="acoes">
                <button class="acoes__editar btn" onclick="abrirModal(${paleta.id})">Editar</button> 
                <button class="acoes__apagar btn" onclick="abrirModalDelete(${paleta.id})">Apagar</button> 
              </div>
            </div>
    </div>
    <img class="paletaItem__img" src="${novaPaleta.foto}" alt="Paleta de ${novaPaleta.sabor}" />
  </div>`;

  if(modoEdicao){
    document.querySelector(`#paletaItem_${paleta.id}`).outerHTML = html;
  }else{
    document.querySelector("#contentList").insertAdjacentHTML("beforeend", html);
  }

  fecharModal();
  location.reload();
  mensagem(novaPaleta.message,'');
}

function mensagem(message, types){
  const modal = document.querySelector(".modal-alert");

  setTimeout(() => {
    modal.style.display = "none";
    location.reload();
  }, 3000);

  document.querySelector("#modal-alert").style.display = "flex";
  document.getElementById("message").innerHTML = message;
  if(types=='alert'){
    document.querySelector(".modal-message").style.backgroundColor = "#ff9700";
  }else if(types=='erro'){
    document.querySelector(".modal-message").style.backgroundColor = "#fc676d";
  }else{
    document.querySelector(".modal-message").style.backgroundColor = "#6ffb74";
  }
}

function abrirModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn_delete_yes")

  btnSim.addEventListener("click", function() {
    deletePaleta(id);
  })
}

const deletePaleta = async (id) => {
  const response = await fetch(`${baseUrl}/delete/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  const result = await response.json();
  document.getElementById("contentList").innerHTML = "";
  fecharModal();
  mensagem(result.message,'');
  /* window.location.reload(); */
  findAllPaletas();
};
