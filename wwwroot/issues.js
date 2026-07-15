let _viewer;
const leveColor = new THREE.Vector4(1,1,0,1)
const ModeradoColor = new THREE.Vector4(1,0.5,0,1)
const GraveColor = new THREE.Vector4(1,0,0,1)


export const initIssues = async (viewer) => {
    _viewer = viewer
    loadUI()
    loadIssues()
    
}

const loadCategories = () => {
_viewer.model.getBulkProperties() //aqui voy...
}

const loadIssues = async () => {
    const res = await fetch('/api/issues')
    const json = await res.json()
    const issuesDiv = document.getElementById('issues')
    issuesDiv.innerHTML = ''
    const issueslist = document.createElement('ul')
    json.data.forEach(issue => {
        const issueItem = document.createElement('li');
        issueItem.textContent = `#${issue.number} ${issue.name} - ${issue.status}`
        const color = getColorHexByStatus(issue.status)
        issueItem.style.color = color
        issueItem.id = issue._id;
        issueItem.addEventListener('click', onIssueClick);                      
        issueslist.appendChild(issueItem);
    })
    issuesDiv.appendChild(issueslist);

}


const loadUI = () => {
    const createIssueForm = document.getElementById("createIssue")
    createIssueForm.addEventListener("submit", onFormSubmit)  
  
    _viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, () =>{ 
        loadCategories()       
        const showAll = document.getElementById('showAll');
        const colorByStatus = document.getElementById('ColorByStatus');
        showAll.disabled = false
        colorByStatus.disabled = false
        showAll.addEventListener("click", () => {
        _viewer.clearThemingColors()  
        _viewer.showAll();
        _viewer.fitToView();             
    })
    colorByStatus.addEventListener("click" , async ()=> {
        const res = await fetch(`/api/issues/status`) 
        const json = await res.json()
        let dbIds = []
        json.data.forEach(item => {
            const status = item._id
            if (status) {                
                item.dbIds.forEach(dbId => {
                    dbIds.push(dbId)
                    _viewer.setThemingColor(dbId,getColorByStatus(status))
                })
            }
        })         
        _viewer.isolate(dbIds)
        _viewer.fitToView(dbIds)
    })
    })    
}

const onFormSubmit = async (e) => {
    // Evita que el formulario actue por defecto y cambie el navegador
     e.preventDefault()
     // Recupera los valores del formulario (number, name) y se crea el objeto body
        const number = document.getElementById("number").value
        const name = document.getElementById("name").value
        const status = document.getElementById("status").value
        const description = document.getElementById("description").value
        console.log("status: ", status)
        const dbIds = _viewer.getSelection()
        const body = {
            number,
            name,
            dbIds,
            status,
            description,
        }
        try {
     //Se guarda con fetch POST el issue en la BD en Mongo
          const res = await fetch (`/api/issues`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        })
        console.log("res:", res)
     //Se gestionan los errores al diligenciar el formulario
        if (res.ok){
            document.getElementById("number").value=""
            document.getElementById("name").value=""
            _viewer.clearSelection()
        }else {
            alert("Hay que indicar número y nombre de Issue")
        }

        loadIssues()        
        } catch (error) {
            
        }
          
}


const onIssueClick = async (e) => {
    const issueId = e.currentTarget.id
    const res = await fetch(`/api/issues/${issueId}`) 
    const json = await res.json()    
    const color = getColorByStatus(json.data.status)
    json.data.dbIds.forEach((dbId) => {
        _viewer.setThemingColor(dbId, color)
    })    
    _viewer.isolate(json.data.dbIds)
    _viewer.fitToView(json.data.dbIds)
}

const getColorHexByStatus = (status) => {
    switch (status) {
        case "Leve": 
            return "#ffff00"
        case "Moderado":
            return "#ffa500"
        case "Grave":
            return "#ff0000"
    }
}
const getColorByStatus = (status) => {
    switch (status) {
        case "Leve": 
            return leveColor
        case "Moderado":
            return ModeradoColor
        case "Grave":
            return GraveColor
    }
}