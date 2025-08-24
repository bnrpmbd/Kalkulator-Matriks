// Matrix Calculator JavaScript Implementation
class MatrixCalculator {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const calculateBtn = document.getElementById('calculate-btn');
        calculateBtn.addEventListener('click', () => this.calculate());
        
        // Add event listener for example matrices
        const exampleSelect = document.getElementById('example-matrices');
        const matrixInput = document.getElementById('matrix-input');
        
        exampleSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                matrixInput.value = e.target.value.replace(/&#10;/g, '\n');
                e.target.value = ''; // Reset selection
            }
        });
    }

    // Convert text input to matrix
    textToMatrix(text) {
        try {
            const rows = text.trim().split('\n');
            const matrix = rows.map(row => 
                row.trim().split(/\s+/).map(num => parseFloat(num))
            );
            
            // Validate matrix dimensions
            const cols = matrix[0].length;
            for (let row of matrix) {
                if (row.length !== cols) {
                    throw new Error('Semua baris harus memiliki jumlah kolom yang sama');
                }
                if (row.some(num => isNaN(num))) {
                    throw new Error('Semua elemen harus berupa angka');
                }
            }
            
            return math.matrix(matrix);
        } catch (error) {
            throw new Error(`Error mengkonversi input ke matriks: ${error.message}`);
        }
    }

    // Check if matrix is square
    isSquareMatrix(matrix) {
        const size = math.size(matrix);
        return size[0] === size[1];
    }

    // Check if matrix is symmetric
    isSymmetric(matrix) {
        const matrixArray = matrix.toArray();
        const transpose = math.transpose(matrix).toArray();
        
        for (let i = 0; i < matrixArray.length; i++) {
            for (let j = 0; j < matrixArray[i].length; j++) {
                if (Math.abs(matrixArray[i][j] - transpose[i][j]) > 1e-10) {
                    return false;
                }
            }
        }
        return true;
    }

    // Make matrix symmetric
    makeSymmetric(matrix) {
        const transpose = math.transpose(matrix);
        return math.divide(math.add(matrix, transpose), 2);
    }

    // Check if matrix is positive definite
    isPositiveDefinite(matrix) {
        try {
            const matrixArray = matrix.toArray();
            const n = matrixArray.length;
            
            // Try Cholesky decomposition to check positive definiteness
            const L = Array(n).fill().map(() => Array(n).fill(0));

            for (let i = 0; i < n; i++) {
                for (let j = 0; j <= i; j++) {
                    if (i === j) {
                        let sum = 0;
                        for (let k = 0; k < j; k++) {
                            sum += L[j][k] * L[j][k];
                        }
                        const diagonal = matrixArray[j][j] - sum;
                        if (diagonal <= 0) return false;
                        L[j][j] = Math.sqrt(diagonal);
                    } else {
                        let sum = 0;
                        for (let k = 0; k < j; k++) {
                            sum += L[i][k] * L[j][k];
                        }
                        L[i][j] = (matrixArray[i][j] - sum) / L[j][j];
                    }
                }
            }
            return true;
        } catch (error) {
            return false;
        }
    }

    // Make matrix positive definite
    makePositiveDefinite(matrix) {
        try {
            const matrixArray = matrix.toArray();
            const n = matrixArray.length;
            
            // Calculate eigenvalues using a more robust method
            let minEigenval = Infinity;
            try {
                const eigenvals = math.eigs(matrix).values;
                const eigenvalsArray = Array.isArray(eigenvals) ? eigenvals : eigenvals.toArray();
                minEigenval = Math.min(...eigenvalsArray.map(val => 
                    typeof val === 'number' ? val : (val.re || 0)
                ));
            } catch (error) {
                // If eigenvalue computation fails, use a simple estimate
                minEigenval = 0;
            }
            
            if (minEigenval <= 0) {
                const adjustment = Math.abs(minEigenval) + 0.01;
                const newMatrix = matrixArray.map((row, i) => 
                    row.map((val, j) => i === j ? val + adjustment : val)
                );
                return math.matrix(newMatrix);
            }
            return matrix;
        } catch (error) {
            // Fallback: add small positive values to diagonal
            const matrixArray = matrix.toArray();
            const newMatrix = matrixArray.map((row, i) => 
                row.map((val, j) => i === j ? val + 1.0 : val)
            );
            return math.matrix(newMatrix);
        }
    }

    // Format matrix for display
    formatMatrix(matrix) {
        if (!matrix) return 'N/A';
        
        try {
            let arr;
            
            // Handle different matrix formats
            if (Array.isArray(matrix)) {
                arr = matrix;
            } else if (matrix.toArray && typeof matrix.toArray === 'function') {
                arr = matrix.toArray();
            } else if (matrix._data) {
                // Handle Math.js matrix object with _data property
                arr = matrix._data;
            } else if (typeof matrix === 'object' && matrix.constructor.name === 'Matrix') {
                // Another way to handle Math.js matrix
                arr = math.format(matrix, {notation: 'fixed', precision: 6}).split('\n').map(row => 
                    row.trim().split(/\s+/).map(val => parseFloat(val))
                );
            } else {
                // Fallback: try to convert using math.js
                arr = math.evaluate(`format(${matrix}, {notation: 'fixed', precision: 6})`);
            }
            
            // Format the array for display
            return arr.map(row => {
                if (Array.isArray(row)) {
                    return row.map(val => {
                        if (typeof val === 'number') {
                            return val.toFixed(6).replace(/\.?0+$/, '');
                        } else if (val && val.re !== undefined) {
                            const real = val.re.toFixed(6).replace(/\.?0+$/, '');
                            const imag = val.im.toFixed(6).replace(/\.?0+$/, '');
                            if (parseFloat(imag) === 0) return real;
                            return `${real} + ${imag}i`;
                        }
                        return val.toString();
                    }).join('\t');
                } else {
                    // Handle single values
                    if (typeof row === 'number') {
                        return row.toFixed(6).replace(/\.?0+$/, '');
                    } else if (row && row.re !== undefined) {
                        const real = row.re.toFixed(6).replace(/\.?0+$/, '');
                        const imag = row.im.toFixed(6).replace(/\.?0+$/, '');
                        if (parseFloat(imag) === 0) return real;
                        return `${real} + ${imag}i`;
                    }
                    return row.toString();
                }
            }).join('\n');
        } catch (error) {
            console.error('Error formatting matrix:', error);
            return 'Error formatting matrix';
        }
    }

    // Format eigenvalues for display
    formatEigenvalues(eigenvals) {
        // Convert eigenvals to array if it's not already
        const eigenvalsArray = Array.isArray(eigenvals) ? eigenvals : eigenvals.toArray();
        
        return eigenvalsArray.map(val => {
            if (typeof val === 'number') {
                return val.toFixed(6).replace(/\.?0+$/, '');
            } else if (val && val.re !== undefined) {
                const real = val.re.toFixed(6).replace(/\.?0+$/, '');
                const imag = val.im.toFixed(6).replace(/\.?0+$/, '');
                if (parseFloat(imag) === 0) return real;
                return `${real} + ${imag}i`;
            }
            return val.toString();
        }).join('\n');
    }

    // Display results
    displayResult(title, content) {
        const resultSection = document.getElementById('result-section');
        resultSection.innerHTML = `
            <div class="result-title">${title}</div>
            ${content}
        `;
        resultSection.classList.add('show');
    }

    // Display error
    displayError(message) {
        const resultSection = document.getElementById('result-section');
        resultSection.innerHTML = `
            <div class="error-message">
                <strong>Error:</strong> ${message}
            </div>
        `;
        resultSection.classList.add('show');
    }

    // Display warning
    displayWarning(message) {
        return `<div class="warning-message"><strong>Peringatan:</strong> ${message}</div>`;
    }

    // Display info
    displayInfo(message) {
        return `<div class="info-message"><strong>Info:</strong> ${message}</div>`;
    }

    // LU Decomposition using math.js
    luDecomposition(matrix) {
        try {
            const result = math.lup(matrix);
            return {
                L: result.L,
                U: result.U,
                P: result.P
            };
        } catch (error) {
            throw new Error('LU decomposition gagal: ' + error.message);
        }
    }

    // Cholesky Decomposition
    choleskyDecomposition(matrix) {
        try {
            const matrixArray = matrix.toArray();
            const n = matrixArray.length;
            const L = Array(n).fill().map(() => Array(n).fill(0));

            for (let i = 0; i < n; i++) {
                for (let j = 0; j <= i; j++) {
                    if (i === j) {
                        let sum = 0;
                        for (let k = 0; k < j; k++) {
                            sum += L[j][k] * L[j][k];
                        }
                        const diagonal = matrixArray[j][j] - sum;
                        
                        if (diagonal <= 0) {
                            throw new Error(`Matriks tidak positive definite pada diagonal ${j+1}`);
                        }
                        
                        L[j][j] = Math.sqrt(diagonal);
                    } else {
                        let sum = 0;
                        for (let k = 0; k < j; k++) {
                            sum += L[i][k] * L[j][k];
                        }
                        
                        if (L[j][j] === 0) {
                            throw new Error(`Division by zero pada elemen L[${j+1}][${j+1}]`);
                        }
                        
                        L[i][j] = (matrixArray[i][j] - sum) / L[j][j];
                    }
                }
            }

            const LMatrix = math.matrix(L);
            const LT = math.transpose(LMatrix);
            return { L: LMatrix, LT: LT };
        } catch (error) {
            throw new Error('Cholesky decomposition gagal: ' + error.message);
        }
    }

    // Doolittle Decomposition
    doolittleDecomposition(matrix) {
        try {
            const matrixArray = matrix.toArray();
            const n = matrixArray.length;
            const L = Array(n).fill().map((_, i) => Array(n).fill().map((_, j) => i === j ? 1 : 0));
            const U = Array(n).fill().map(() => Array(n).fill(0));

            for (let j = 0; j < n; j++) {
                // Calculate U[i][j] for i <= j
                for (let i = 0; i <= j; i++) {
                    let sum = 0;
                    for (let k = 0; k < i; k++) {
                        sum += L[i][k] * U[k][j];
                    }
                    U[i][j] = matrixArray[i][j] - sum;
                }

                // Calculate L[i][j] for i > j
                for (let i = j + 1; i < n; i++) {
                    let sum = 0;
                    for (let k = 0; k < j; k++) {
                        sum += L[i][k] * U[k][j];
                    }
                    if (Math.abs(U[j][j]) < 1e-10) {
                        throw new Error(`Matriks singular atau hampir singular pada pivot ${j+1}`);
                    }
                    L[i][j] = (matrixArray[i][j] - sum) / U[j][j];
                }
            }

            return {
                L: math.matrix(L),
                U: math.matrix(U)
            };
        } catch (error) {
            throw new Error('Doolittle decomposition gagal: ' + error.message);
        }
    }

    // Crout Decomposition
    croutDecomposition(matrix) {
        try {
            const matrixArray = matrix.toArray();
            const n = matrixArray.length;
            const L = Array(n).fill().map(() => Array(n).fill(0));
            const U = Array(n).fill().map((_, i) => Array(n).fill().map((_, j) => i === j ? 1 : 0));

            for (let j = 0; j < n; j++) {
                // Calculate L[i][j] for i >= j
                for (let i = j; i < n; i++) {
                    let sum = 0;
                    for (let k = 0; k < j; k++) {
                        sum += L[i][k] * U[k][j];
                    }
                    L[i][j] = matrixArray[i][j] - sum;
                }

                // Calculate U[i][j] for i < j
                for (let i = 0; i < j; i++) {
                    let sum = 0;
                    for (let k = 0; k < i; k++) {
                        sum += L[i][k] * U[k][j];
                    }
                    if (Math.abs(L[i][i]) < 1e-10) {
                        throw new Error(`Matriks singular atau hampir singular pada pivot ${i+1}`);
                    }
                    U[i][j] = (matrixArray[i][j] - sum) / L[i][i];
                }
            }

            return {
                L: math.matrix(L),
                U: math.matrix(U)
            };
        } catch (error) {
            throw new Error('Crout decomposition gagal: ' + error.message);
        }
    }

    // Main calculation method
    calculate() {
        try {
            const matrixInput = document.getElementById('matrix-input').value;
            const method = document.getElementById('method-select').value;

            if (!matrixInput.trim()) {
                this.displayError('Silakan masukkan matriks terlebih dahulu');
                return;
            }

            const matrix = this.textToMatrix(matrixInput);
            let content = `
                <div class="matrix-display">
                    <div class="matrix-title">Input Matriks:</div>
                    <div class="matrix-content">${this.formatMatrix(matrix)}</div>
                </div>
            `;

            switch (method) {
                case 'eigenvalues':
                    content += this.calculateEigenvalues(matrix);
                    break;
                case 'diagonalization':
                    content += this.calculateDiagonalization(matrix);
                    break;
                case 'lu-decomposition':
                    content += this.calculateLUDecomposition(matrix);
                    break;
                case 'cholesky':
                    content += this.calculateCholesky(matrix);
                    break;
                case 'doolittle':
                    content += this.calculateDoolittle(matrix);
                    break;
                case 'crout':
                    content += this.calculateCrout(matrix);
                    break;
                default:
                    throw new Error('Metode tidak dikenal');
            }

            this.displayResult('Hasil Perhitungan', content);

        } catch (error) {
            this.displayError(error.message);
        }
    }

    calculateEigenvalues(matrix) {
        if (!this.isSquareMatrix(matrix)) {
            throw new Error('Matriks harus persegi untuk menghitung eigenvalue dan eigenvector');
        }

        try {
            const eigs = math.eigs(matrix);
            const eigenvalues = eigs.values;
            const eigenvectors = eigs.vectors;

            // Convert eigenvalues to array for display
            let eigenvaluesArray;
            if (Array.isArray(eigenvalues)) {
                eigenvaluesArray = eigenvalues;
            } else if (eigenvalues && eigenvalues.toArray && typeof eigenvalues.toArray === 'function') {
                eigenvaluesArray = eigenvalues.toArray();
            } else if (eigenvalues && eigenvalues._data) {
                eigenvaluesArray = eigenvalues._data;
            } else {
                eigenvaluesArray = [eigenvalues];
            }

            return `
                <div class="matrix-display">
                    <div class="matrix-title">Nilai Eigen (Eigenvalues):</div>
                    <div class="matrix-content">${this.formatEigenvalues(eigenvaluesArray)}</div>
                </div>
                <div class="matrix-display">
                    <div class="matrix-title">Vektor Eigen (Eigenvectors):</div>
                    <div class="matrix-content">${this.formatMatrix(eigenvectors)}</div>
                </div>
            `;
        } catch (error) {
            throw new Error('Perhitungan eigenvalue gagal: ' + error.message);
        }
    }

    calculateDiagonalization(matrix) {
        if (!this.isSquareMatrix(matrix)) {
            throw new Error('Matriks harus persegi untuk diagonalisasi');
        }

        try {
            const eigs = math.eigs(matrix);
            let eigenvalues = eigs.values;
            const eigenvectors = eigs.vectors;
            
            // Handle eigenvalues conversion more robustly
            let eigenvaluesForDiag;
            
            if (Array.isArray(eigenvalues)) {
                eigenvaluesForDiag = eigenvalues;
            } else {
                // Try different methods to extract eigenvalues
                try {
                    if (eigenvalues && eigenvalues.toArray && typeof eigenvalues.toArray === 'function') {
                        eigenvaluesForDiag = eigenvalues.toArray();
                    } else if (eigenvalues && eigenvalues._data) {
                        eigenvaluesForDiag = eigenvalues._data;
                    } else {
                        // Fallback: assume single eigenvalue
                        eigenvaluesForDiag = [eigenvalues];
                    }
                } catch (conversionError) {
                    eigenvaluesForDiag = [eigenvalues];
                }
            }
            
            // Create diagonal matrix
            let D;
            try {
                D = math.diag(eigenvaluesForDiag);
            } catch (diagError) {
                // Manual diagonal matrix creation
                const n = eigenvaluesForDiag.length;
                const diagArray = Array(n).fill().map(() => Array(n).fill(0));
                for (let i = 0; i < n; i++) {
                    diagArray[i][i] = typeof eigenvaluesForDiag[i] === 'number' ? 
                        eigenvaluesForDiag[i] : 
                        (eigenvaluesForDiag[i].re || eigenvaluesForDiag[i]);
                }
                D = math.matrix(diagArray);
            }
            
            const P = eigenvectors;
            
            // Calculate inverse of P
            let PInv;
            try {
                PInv = math.inv(P);
            } catch (invError) {
                throw new Error('Matriks tidak dapat didiagonalisasi (eigenvectors tidak independen linear)');
            }

            // Verification: P * D * P^-1 should equal original matrix
            let verification;
            try {
                verification = math.multiply(math.multiply(P, D), PInv);
            } catch (verifyError) {
                verification = null;
            }

            let content = `
                <div class="matrix-display">
                    <div class="matrix-title">P (Matriks Vektor Eigen):</div>
                    <div class="matrix-content">${this.formatMatrix(P)}</div>
                </div>
                <div class="matrix-display">
                    <div class="matrix-title">P⁻¹ (Invers dari P):</div>
                    <div class="matrix-content">${this.formatMatrix(PInv)}</div>
                </div>
                <div class="matrix-display">
                    <div class="matrix-title">D (Matriks Diagonal Eigenvalues):</div>
                    <div class="matrix-content">${this.formatMatrix(D)}</div>
                </div>
            `;
            
            if (verification) {
                content += `
                    <div class="matrix-display">
                        <div class="matrix-title">Verifikasi P × D × P⁻¹:</div>
                        <div class="matrix-content">${this.formatMatrix(verification)}</div>
                    </div>
                `;
            }
            
            return content;
            
        } catch (error) {
            throw new Error('Diagonalisasi gagal: ' + error.message);
        }
    }

    calculateLUDecomposition(matrix) {
        if (!this.isSquareMatrix(matrix)) {
            throw new Error('Matriks harus persegi untuk dekomposisi LU');
        }

        const result = this.luDecomposition(matrix);
        const verification = math.multiply(result.L, result.U);

        return `
            <div class="matrix-display">
                <div class="matrix-title">P (Matriks Permutasi):</div>
                <div class="matrix-content">${this.formatMatrix(result.P)}</div>
            </div>
            <div class="matrix-display">
                <div class="matrix-title">L (Matriks Segitiga Bawah):</div>
                <div class="matrix-content">${this.formatMatrix(result.L)}</div>
            </div>
            <div class="matrix-display">
                <div class="matrix-title">U (Matriks Segitiga Atas):</div>
                <div class="matrix-content">${this.formatMatrix(result.U)}</div>
            </div>
            <div class="matrix-display">
                <div class="matrix-title">Verifikasi L × U:</div>
                <div class="matrix-content">${this.formatMatrix(verification)}</div>
            </div>
        `;
    }

    calculateCholesky(matrix) {
        if (!this.isSquareMatrix(matrix)) {
            throw new Error('Matriks harus persegi untuk dekomposisi Cholesky');
        }

        let processedMatrix = matrix;
        let warnings = '';

        // Check if symmetric
        if (!this.isSymmetric(matrix)) {
            warnings += this.displayWarning('Matriks tidak simetris. Mengkonversi ke matriks simetris.');
            processedMatrix = this.makeSymmetric(processedMatrix);
        }

        // Check if positive definite
        if (!this.isPositiveDefinite(processedMatrix)) {
            warnings += this.displayWarning('Matriks tidak positive definite. Mengkonversi ke positive definite.');
            processedMatrix = this.makePositiveDefinite(processedMatrix);
        }

        try {
            const result = this.choleskyDecomposition(processedMatrix);
            const verification = math.multiply(result.L, result.LT);

            let content = warnings;
            
            if (!math.deepEqual(matrix.toArray(), processedMatrix.toArray())) {
                content += `
                    <div class="matrix-display">
                        <div class="matrix-title">Matriks yang Diproses:</div>
                        <div class="matrix-content">${this.formatMatrix(processedMatrix)}</div>
                    </div>
                `;
            }

            content += `
                <div class="matrix-display">
                    <div class="matrix-title">L (Matriks Segitiga Bawah):</div>
                    <div class="matrix-content">${this.formatMatrix(result.L)}</div>
                </div>
                <div class="matrix-display">
                    <div class="matrix-title">Lᵀ (Transpose dari L):</div>
                    <div class="matrix-content">${this.formatMatrix(result.LT)}</div>
                </div>
                <div class="matrix-display">
                    <div class="matrix-title">Verifikasi L × Lᵀ:</div>
                    <div class="matrix-content">${this.formatMatrix(verification)}</div>
                </div>
            `;

            return content;
        } catch (error) {
            // If Cholesky still fails, provide a helpful error message
            throw new Error('Dekomposisi Cholesky gagal setelah preprocessing. Matriks mungkin singular atau memiliki kondisi numerik yang buruk.');
        }
    }

    calculateDoolittle(matrix) {
        if (!this.isSquareMatrix(matrix)) {
            throw new Error('Matriks harus persegi untuk dekomposisi Doolittle');
        }

        const result = this.doolittleDecomposition(matrix);
        const verification = math.multiply(result.L, result.U);

        return `
            <div class="matrix-display">
                <div class="matrix-title">L (Matriks Segitiga Bawah):</div>
                <div class="matrix-content">${this.formatMatrix(result.L)}</div>
            </div>
            <div class="matrix-display">
                <div class="matrix-title">U (Matriks Segitiga Atas):</div>
                <div class="matrix-content">${this.formatMatrix(result.U)}</div>
            </div>
            <div class="matrix-display">
                <div class="matrix-title">Verifikasi L × U:</div>
                <div class="matrix-content">${this.formatMatrix(verification)}</div>
            </div>
        `;
    }

    calculateCrout(matrix) {
        if (!this.isSquareMatrix(matrix)) {
            throw new Error('Matriks harus persegi untuk dekomposisi Crout');
        }

        const result = this.croutDecomposition(matrix);
        const verification = math.multiply(result.L, result.U);

        return `
            <div class="matrix-display">
                <div class="matrix-title">L (Matriks Segitiga Bawah):</div>
                <div class="matrix-content">${this.formatMatrix(result.L)}</div>
            </div>
            <div class="matrix-display">
                <div class="matrix-title">U (Matriks Segitiga Atas):</div>
                <div class="matrix-content">${this.formatMatrix(result.U)}</div>
            </div>
            <div class="matrix-display">
                <div class="matrix-title">Verifikasi L × U:</div>
                <div class="matrix-content">${this.formatMatrix(verification)}</div>
            </div>
        `;
    }
}

// Initialize the calculator when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MatrixCalculator();
});
