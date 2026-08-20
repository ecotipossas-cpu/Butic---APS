const init = () => {
    const bucketForm = document.getElementById('createBucket');
    if (bucketForm) {
        bucketForm.addEventListener('click', onFormSubmit);
    }
    listBuckets();
};

const listBuckets = async () => {
    const res = await fetch('/api/buckets');
    const json = await res.json();

    const buckets = document.getElementById('buckets');
    buckets.innerHTML = '';

    const initOption = document.createElement('option');
    initOption.selected = true;
    initOption.disabled = true;
    initOption.textContent = 'Elige un bucket';
    buckets.appendChild(initOption);

    json.forEach((bucket) => {
        const bucketElement = document.createElement('option');
        bucketElement.value = bucket;
        bucketElement.textContent = bucket;
        buckets.appendChild(bucketElement);
    });

    buckets.addEventListener('change', onBucketSelect);
};

const onBucketSelect = async (e) => {
    const bucketId = e.currentTarget.value;
    const res = await fetch(`/api/models/${encodeURIComponent(bucketId)}`);
    const json = await res.json();
    
    const cardContainer = document.getElementById('cardContainer');
    cardContainer.innerHTML = '';
    const cardRow = document.createElement('div');
    cardRow.className = 'd-flex flex-row';

    const input = document.getElementById('input');
    input.hidden = false;

    json.forEach((cardData) => {
        const card = document.createElement('div');
        card.className = 'card m-3';
        card.style.width = '18rem';

        const cardImg = document.createElement('img');
        cardImg.className = 'card-img-top';
        cardImg.alt = 'Card image cap';

        // Manejador de fallos: Si la imagen base64 es inválida, muestra la SVG local
        cardImg.onerror = () => {
            cardImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%23e9ecef"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236c757d">Sin Vista Previa</text></svg>';
        };

        if (cardData.thumbnail && cardData.thumbnail !== 'no-image') {
            cardImg.src = 'data:image/png;base64,' + cardData.thumbnail;
        } else {
            cardImg.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%23e9ecef"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%236c757d">Sin Vista Previa</text></svg>';
        }

        cardImg.alt = 'Card image cap';

        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = cardData.name;

        const cardLink = document.createElement('a');
        cardLink.href = '/viewer?urn=' + cardData.urn;
        cardLink.className = 'btn btn-primary';
        cardLink.textContent = 'Go to Viewer';

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardLink);

        card.appendChild(cardImg);
        card.appendChild(cardBody);

        cardRow.appendChild(card);
    });

    cardContainer.appendChild(cardRow);

    input.onchange = async () => {
        const file = input.files[0];
        let data = new FormData();
        data.append('model-file', file);
        try {
            const resp = await fetch(`/api/models/${encodeURIComponent(bucketId)}`, {
                method: 'POST',
                body: data,
            });
            if (!resp.ok) {
                throw new Error(await resp.text());
            }
            await resp.json();
        } catch (error) {
            alert(`Could not upload model ${file.name}. See the console for more details.`);
            console.error(error);
        } finally {
            input.value = '';
        }
    };
};

const onFormSubmit = async () => {
    const bucketName = document.getElementById('bucketName').value;
    const body = {
        name: bucketName,
    };

    const res = await fetch('/api/buckets', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    console.log('res: ', res);
    listBuckets();
};

init();