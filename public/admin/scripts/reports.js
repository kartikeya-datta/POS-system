document.addEventListener('DOMContentLoaded', async function () {

    const reports = await fetch('/admin/getAnalytics', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        } 
    }).then((res) => res.json())
    console.log(reports);
    if(reports.prod && reports.inventory && reports.sales){
        const prodGroupedData = {}, prodGroupedCount = {}, invenGroupedData= {}, invenGroupedCount = {}, salesGroupedData = {}, salesGroupedCount = {};
        reports.prod.forEach(product => {
                const addedAtDate = new Date(product.addedAt);
                let month = addedAtDate.getMonth(); 
                let months = ["Jan", "Feb", "Mar", "Apr"]
                month = months[month]
                const year = addedAtDate.getFullYear()

                if (!prodGroupedData[`${month}-${year}`]) {
                    prodGroupedData[`${month}-${year}`] = {};
                }
                const { productId, quantity } = product;
                if (!prodGroupedData[`${month}-${year}`][productId]) {
                    prodGroupedData[`${month}-${year}`][productId] = quantity;
                } else {
                    prodGroupedData[`${month}-${year}`][productId] += quantity;
                }
                if (!prodGroupedCount[`${month}-${year}`]) {
                    prodGroupedCount[`${month}-${year}`] = quantity;
                } else {
                    prodGroupedCount[`${month}-${year}`] += quantity;
                }

        });

        reports.inventory.forEach(product => {
            const addedAtDate = new Date(product.addedAt);
            let month = addedAtDate.getMonth(); 
            let months = ["Jan", "Feb", "Mar", "Apr"]
            month = months[month]
            const year = addedAtDate.getFullYear()

            if (!invenGroupedData[`${month}-${year}`]) {
                invenGroupedData[`${month}-${year}`] = {};
            }
            const { productId, stock } = product;
            if (!invenGroupedData[`${month}-${year}`][productId]) {
                invenGroupedData[`${month}-${year}`][productId] = stock;
            } else {
                invenGroupedData[`${month}-${year}`][productId] += stock;
            }
            if (!invenGroupedCount[`${month}-${year}`]) {
                invenGroupedCount[`${month}-${year}`] = stock;
            } else {
                invenGroupedCount[`${month}-${year}`] += stock;
            }

        });

        reports.sales.forEach(product => {
            const addedAtDate = new Date(product.billDate);
            let month = addedAtDate.getMonth(); 
            let months = ["Jan", "Feb", "Mar", "Apr"]
            month = months[month]
            const year = addedAtDate.getFullYear()
            const { totalQuantity } = product;
            if (!salesGroupedCount[`${month}-${year}`]) {
                salesGroupedCount[`${month}-${year}`] = Number(totalQuantity);
               // console.log(salesGroupedCount)
            } else {
                salesGroupedCount[`${month}-${year}`] = Number(salesGroupedCount[`${month}-${year}`]) + Number(totalQuantity);
               // console.log(salesGroupedCount)
            }

        });
        
        console.log(prodGroupedCount,invenGroupedCount, salesGroupedCount)
        const pieCTX = document.getElementById('pieChart');
        const pieChartOptions = document.getElementById('pieChartSelection')
        let myPieChart; 
        // Convert keys to Date objects and sort them
        const sortedMonths = Object.keys(prodGroupedCount)
        .map(month => new Date(month))
        .sort((a, b) => a - b);

        // Format sorted months back to month-year strings
        const formattedMonths = sortedMonths.map(date => {
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${month}-${year}`;
        });
        console.log(formattedMonths)
        // Initial chart creation
        pieChartOptions.innerHTML = '';
        formattedMonths.forEach((a) => {
            x = `<option value='${a}'>${a}</option>`
            pieChartOptions.innerHTML += x
        })
        
        pieChartOptions.addEventListener('change', (e) => {
            console.log(e.target.value);
            updatePieChart(e.target.value);
        });
        
        async function updatePieChart(slot) {
            if (myPieChart) {
                myPieChart.destroy();
            }
            console.log(slot, prodGroupedCount[slot],  Number(prodGroupedCount[slot] - salesGroupedCount[slot]), salesGroupedCount[slot]);
            myPieChart = new Chart(pieCTX, {
                type: 'pie',
                data: {
                    labels: ['Products', 'Inventory', 'Sales'],
                    datasets: [{
                        label: 'Retail Report',
                        data: [prodGroupedCount[slot], Number(prodGroupedCount[slot] - salesGroupedCount[slot]), salesGroupedCount[slot]],
                        borderWidth: 1
                    }]
                },
                options: {
                }
            });
        }
          pieChartOptions.selectedIndex = formattedMonths.length -1
          updatePieChart(formattedMonths[formattedMonths.length - 1]);        
        
    }


})