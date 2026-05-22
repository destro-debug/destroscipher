document.addEventListener('DOMContentLoaded', () => {
    
    const secretKeyInput = document.getElementById('secretKey');
    const toggleKeyBtn = document.getElementById('toggleKeyBtn');
    const securityWarningBox = document.querySelector('.security-warning-box');
    const decryptBtn = document.getElementById('decryptBtn');
    const copyBtn = document.getElementById('copyBtn');
    const cipherInput = document.getElementById('cipherInput');
    const plainOutput = document.getElementById('plainOutput');
    
    console.log("Decryption script successfully mounted locally.");
    
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
    
    decryptBtn.addEventListener('click', () => {
        const scrambledBlock = cipherInput.value;
        const rawKey = secretKeyInput.value.trim();
        
        if (!scrambledBlock || !rawKey) {
            alert("⚠️ Operational Error: Scrambled text input space and key passphrase fields cannot remain blank.");
            return;
        }
        
        try {
            const decryptedOutput = Engine3.processStream(scrambledBlock, rawKey, false);
            plainOutput.value = decryptedOutput;
        } catch (error) {
            console.error("Cryptographic operation faulted: ", error);
            alert("⚠️ Matrix Decryption Failed. Check the alignment of the input cipher blocks or keys.");
        }
    });
    
    copyBtn.addEventListener('click', () => {
        if (!plainOutput.value || plainOutput.value.startsWith('[')) return;
        
        navigator.clipboard.writeText(plainOutput.value)
            .then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Copied Success! ✓";
                copyBtn.style.borderColor = "var(--accent-decrypt)";
                
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