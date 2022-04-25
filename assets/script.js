const baseUrl = "http://localhost:3000/paletas";
const msgAlert = document.querySelector('.msg-alert');

function closeMessageAlert() {
	setTimeout(function () {
		msgAlert.innerText = '';
		msgAlert.classList.remove(localStorage.getItem('type'));
		localStorage.clear();
	}, 3000);
}

function showMessageAlert() {
	msgAlert.innerText = localStorage.getItem('message');
	msgAlert.classList.add(localStorage.getItem('type'));
	closeMessageAlert();
}

showMessageAlert();

async function findAllPaletas() {
	const response = await fetch(`${baseUrl}/all-paletas`);

	const paletas = await response.json();

	paletas.forEach((paleta) => {
		document.getElementById('contentList').insertAdjacentHTML(
			'beforeend',
			`<div class="paletaItem" id="paletaItem_${paleta._id}">
        <div class="paletaItem-body">
            <div class="paletaItem__sabor">${paleta.sabor}</div>
            <div class="paletaItem__preco">R$ ${paleta.preco}</div>
            <div class="paletaItem__descricao">${paleta.descricao}</div>
            <div class="paletaItem__acoes">
              <div class="acoes">
                <button class="acoes__editar btn" onclick="abrirModal('${
									paleta._id
								}')">Editar</button> 
                <button class="acoes__apagar btn" onclick="abrirModalDelete('${
									paleta._id
								}')">Apagar</button> 
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
	const id = document.querySelector('#idPaleta').value;

	if (id == ' ') {
		localStorage.setItem('message', 'Digite um ID para pesquisar!');
		localStorage.setItem('type', 'danger');
		closeMessageAlert();
		return;
	}

	const response = await fetch(`${baseUrl}/one-paleta/${id}`);

	const paleta = await response.json();

	if (paleta.message != undefined) {
		localStorage.setItem('message', paleta.message);
		localStorage.setItem('type', 'danger');
		showMessageAlert();
		return;
	}

	document.querySelector('.list-all').style.display = 'block';
	document.querySelector('#contentList').style.display = 'none';
	document.querySelector('#cadastrar-button').style.display = 'none';
	const paletaEscolhidaDiv = document.getElementById('paletaEscolhida');

	paletaEscolhidaDiv.innerHTML = `
    <div class="paletaItem" id="paletaItem_${paleta._id}">
      <div>
          <div class="paletaItem__sabor">${paleta.sabor}</div>
          <div class="paletaItem__preco">R$ ${paleta.preco}</div>
          <div class="paletaItem__descricao">${paleta.descricao}</div>
        </div>
          <img class="paletaItem__img" src=${
						paleta.foto
					} alt=${`Paleta de ${paleta.sabor}`} />
    </div>`;
};

function fecharModal() {
	document.querySelector('.modal-overlay').style.display = 'none';
	document.querySelector('#overlay-delete').style.display = 'none';
	document.querySelector('#sabor').value = '';
	document.querySelector('#preco').value = 0;
	document.querySelector('#descricao').value = '';
	document.querySelector('#foto').value = '';
}

async function abrirModal(id = null) {
	if (id != null) {
		document.querySelector('#title-modal').innerText = 'Editar uma paleta';
		document.querySelector('#button-modal').innerText = 'Atualizar';

		const response = await fetch(`${baseUrl}/one-paleta/${id}`);

		const paleta = await response.json();

		document.querySelector('#id').value = paleta._id;
		document.querySelector('#sabor').value = paleta.sabor;
		document.querySelector('#preco').value = paleta.preco;
		document.querySelector('#descricao').value = paleta.descricao;
		document.querySelector('#foto').value = paleta.foto;
	} else {
		document.querySelector('#title-modal').innerText = 'Cadastrar uma paleta';
		document.querySelector('#button-modal').innerText = 'Cadastrar';
	}
	document.querySelector('.modal-overlay').style.display = 'flex';
}

async function createPaleta() {
	const id = document.querySelector('#id').value;
	const sabor = document.querySelector('#sabor').value;
	const preco = document.querySelector('#preco').value;
	const descricao = document.querySelector('#descricao').value;
	const foto = document.querySelector('#foto').value;

	const paleta = {
		id,
		sabor,
		preco,
		descricao,
		foto,
	};

	const modoEdicao = id != '';

	const endpoint =
		baseUrl + (modoEdicao ? `/update-paleta/${id}` : '/create-paleta');

	const response = await fetch(endpoint, {
		method: modoEdicao ? 'put' : 'post',
		headers: {
			'Content-Type': 'application/json',
		},
		mode: 'cors',
		body: JSON.stringify(paleta),
	});

	const novaPaleta = await response.json();

	if (novaPaleta.message == undefined) {
		localStorage.setItem('message', novaPaleta.message);
		localStorage.setItem('type', 'danger');
		showMessageAlert();
		return;
	}

	if (modoEdicao) {
		localStorage.setItem('message', 'Paleta atualizada com sucesso');
		localStorage.setItem('type', 'success');
	} else {
		localStorage.setItem('message', 'Paleta criada com sucesso');
		localStorage.setItem('type', 'success');
	}

	document.location.reload(true);
	fecharModal();
}

function abrirModalDelete(id) {
	document.querySelector('#overlay-delete').style.display = 'flex';

	const btnSim = document.querySelector('.btn_delete_yes');

	btnSim.addEventListener('click', function () {
		deletePaleta(id);
	});
}

const deletePaleta = async (id) => {
	const response = await fetch(`${baseUrl}/delete-paleta/${id}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
		},
		mode: 'cors',
	});
	const result = await response.json();

	localStorage.setItem('message', result.message);
	localStorage.setItem('type', 'success');

	document.location.reload(true);

	fecharModal();
};
