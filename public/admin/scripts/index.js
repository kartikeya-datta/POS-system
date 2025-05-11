const fileDropArea = document.getElementById('file-drop-area')
const fileInput = document.getElementById('file-input');

fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

fileDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropArea.classList.add('dragover');
});

fileDropArea.addEventListener('dragleave', () => {
    fileDropArea.classList.remove('dragover');
});

fileDropArea.addEventListener('drop', (e) => {ea
    e.preventDefault();
    fileDropArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

async function handleFiles(files){
    const uploadDetails = document.getElementById('upload-details')
        for (const file of files) {
            if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel') {
                uploadDetails.textContent = `Uploading ${file.name} (${file.size} bytes)...`;
                const formData = new FormData();
                formData.append("excel", file);
    
                const result = await axios.post('/admin/uploadExcel', formData, {
                      headers: {
                          'Content-Type': 'multipart/form-data'
                      },
                });
                  console.log(result);
                  if(result.data.success){
                    uploadDetails.textContent = ' Upload successful!';
                    setTimeout(() => {
                        alert("Uploaded Successfully");
                        window.location.reload(true);
                        
                    }, 3000);
                    
                    //alert("Uploaded Successfully");
                  }else{
                    uploadDetails.textContent = ' Upload failed: ' + result.data.error;
                    alert(result.errorMessage);
                  }
            } else {
                uploadDetails.textContent = `${file.name} is not a valid Excel file.`;
            }
        }
}


function selectFiles() {
    document.getElementById('file-input').click();
}