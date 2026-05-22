document.addEventListener('DOMContentLoaded', () => {
    
    const secretKeyInput = document.getElementById('secretKey');
    const toggleKeyBtn = document.getElementById('toggleKeyBtn');
    const securityWarningBox = document.querySelector('.security-warning-box');
    const encryptBtn = document.getElementById('encryptBtn');
    const copyBtn = document.getElementById('copyBtn');
    const plainText = document.getElementById('plainText');
    const cipherText = document.getElementById('cipherText');
    
    console.log("Encryption script successfully mounted locally.");
    
    toggleKeyBtn.addEventListener('click', () => {
        if (secretKeyInput.type === 'password') {
            secretKeyInput.type = 'text';
            toggleKeyBtn.textContent = '🙈';
        } else {
            secretKeyInput.type = 'password';
            toggleKeyBtn.textContent = '👁️';
        }
    });
    
    secretKeyInput.addEventListener('focus', () => {
        securityWarningBox.classList.add('active-glow');
    });
    
    secretKeyInput.addEventListener('blur', () => {
        securityWarningBox.classList.remove('active-glow');
    });
    
    encryptBtn.addEventListener('click', () => {
        const rawMessage = plainText.value;
        const rawKey = secretKeyInput.value.trim();
        
        if (!rawMessage || !rawKey) {
            alert("⚠️ Operational Error: Message text space and key passphrase fields cannot remain blank.");
            return;
        }
        
        try {
            const encryptedOutput = Engine3.processStream(rawMessage, rawKey, true);
            cipherText.value = encryptedOutput;
        } catch (error) {
            console.error("Cryptographic operation faulted: ", error);
            alert("⚠️ An internal execution error occurred inside the local client engine matrix.");
        }
    });
    
    copyBtn.addEventListener('click', () => {
        if (!cipherText.value || cipherText.value.startsWith('[')) return;
        
        navigator.clipboard.writeText(cipherText.value)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Copied Success! ✓";
                copyBtn.style.borderColor = "var(--accent-encrypt)";
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.style.borderColor = "var(--border-color)";
                }, 2000);
            })
            .catch(err => {
                console.error("System clipboard capture failed: ", err);
            });
    });
});