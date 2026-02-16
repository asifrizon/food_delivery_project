/**
 * Admin Reports - COMPLETE WITH EXPORT
 */

function initializeReports() {
    addButtonHandlers();
    addStyles();
}

function addButtonHandlers() {
    const viewButtons = document.querySelectorAll('.report-card .btn');
    viewButtons.forEach((button, index) => {
        const reportTitle = button.closest('.report-card').querySelector('h3').textContent;
        button.addEventListener('click', () => viewReport(reportTitle));
    });
    
    const exportBtn = document.querySelector('.filter-section .btn-primary');
    if (exportBtn) exportBtn.addEventListener('click', exportReport);
}

function viewReport(reportName) {
    adminPortal.showLoading();
    
    setTimeout(() => {
        adminPortal.hideLoading();
        
        const reportData = generateReportData(reportName);
        showReportModal(reportName, reportData);
    }, 1000);
}

function generateReportData(reportName) {
    const data = {
        'Revenue Report': [
            ['Date', 'Orders', 'Revenue'],
            ['2026-02-01', '45', '৳12,500'],
            ['2026-02-02', '52', '৳15,200'],
            ['2026-02-03', '38', '৳9,800']
        ],
        'Orders Report': [
            ['Status', 'Count', 'Percentage'],
            ['Delivered', '1,234', '65%'],
            ['Pending', '234', '12%'],
            ['Cancelled', '123', '6%']
        ],
        'User Growth Report': [
            ['Month', 'New Users', 'Total Users'],
            ['January', '145', '1,089'],
            ['February', '87', '1,234']
        ]
    };
    
    return data[reportName] || [['No data available']];
}

function showReportModal(title, data) {
    const tableRows = data.map((row, i) => 
        `<tr>${row.map(cell => i === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`).join('')}</tr>`
    ).join('');
    
    const modalHtml = `
        <div id="reportModal" class="modal" style="display: flex;">
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-file-alt"></i> ${title}</h2>
                    <span class="modal-close" onclick="closeReportModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <table class="data-table">
                        ${tableRows}
                    </table>
                    <div style="margin-top: 20px; display: flex; gap: 10px; justify-content: flex-end;">
                        <button class="btn btn-primary" onclick="downloadReport('${title}')">
                            <i class="fas fa-download"></i> Download CSV
                        </button>
                        <button class="btn btn-secondary" onclick="closeReportModal()">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) modal.remove();
}

function downloadReport(reportName) {
    const data = generateReportData(reportName);
    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportName.replace(/\s/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    adminPortal.showNotification('Report downloaded successfully!', 'success');
}

function exportReport() {
    const period = document.querySelector('.filter-section select').value;
    adminPortal.showNotification(`Exporting ${period} report...`, 'info');
    
    setTimeout(() => {
        const csv = 'Date,Orders,Revenue\n2026-02-01,45,12500\n2026-02-02,52,15200';
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Platform_Report_${period.replace(/\s/g, '_')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        adminPortal.showNotification('Export complete!', 'success');
    }, 1000);
}

function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .reports-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .report-card { background: white; padding: 25px; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); text-align: center; transition: all 0.3s; }
        .report-card:hover { transform: translateY(-5px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
        .report-icon { width: 70px; height: 70px; background: linear-gradient(135deg, #FF7A00, #e66d00); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 2rem; color: white; }
        .report-card h3 { font-size: 1.2rem; margin-bottom: 10px; color: #1a1a2e; }
        .report-card p { color: #6b7280; font-size: 0.9rem; margin-bottom: 20px; }
        .analytics-placeholder { text-align: center; padding: 60px 20px; background: #f8f9fa; border-radius: 12px; }
    `;
    document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', initializeReports);
