const Engine3 = {
    ASCII_START: 32,
    ASCII_END: 126,
    BASE_RANGE: 95,
    
    passphraseToKey: function(passphrase) {
        if (!passphrase || passphrase.length === 0) return 0;
        let k = 0;
        for (let i = 0; i < passphrase.length; i++) {
            let charCode = passphrase.charCodeAt(passphrase.length - 1 - i);
            let normalizedValue = charCode - this.ASCII_START + 1;
            k += normalizedValue * Math.pow(95, i % 7);
        }
        return Math.abs(k);
    },
    
    processStream: function(text, passphrase, isEncrypt) {
        const k = this.passphraseToKey(passphrase);
        let output = "";
        
        let x = k % 997;
        let y = k % 1009;
        let previousTheta = 1;
        
        for (let idx = 0; idx < text.length; idx++) {
            let i = idx + 1;
            let charCode = text.charCodeAt(idx);
            
            if (charCode < this.ASCII_START || charCode > this.ASCII_END) {
                output += text.charAt(idx);
                continue;
            }
            
            let lambda = charCode - this.ASCII_START + 1;
            
            x = (x * 31 + previousTheta + i) % 997;
            y = (y * 41 + previousTheta + i) % 1009;
            
            let s = ((x + y) % 94) + 1;
            
            let resultValue = 0;
            
            if (isEncrypt) {
                resultValue = ((lambda + s - 1) % this.BASE_RANGE) + 1;
                
                if (lambda === 1 && resultValue === 1) {
                    resultValue = 2;
                }
            } else {
                let theta = lambda;
                
                if (theta === 2 && x === (x * 31 + previousTheta + i) % 997) {
                    let tentativeLambda = ((theta - s - 1 + this.BASE_RANGE) % this.BASE_RANGE) + 1;
                    if (tentativeLambda === 1) {
                        resultValue = 1;
                    }
                }
                
                if (resultValue === 0) {
                    resultValue = ((theta - s - 1 + this.BASE_RANGE) % this.BASE_RANGE) + 1;
                }
            }
            
            previousTheta = isEncrypt ? resultValue : lambda;
            
            let finalCharCode = resultValue + this.ASCII_START - 1;
            output += String.fromCharCode(finalCharCode);
        }
        
        return output;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const revealTargets = document.querySelectorAll('.scroll-reveal');
    
    if (revealTargets.length === 0) return;
    
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
    };
    
    const revealObserver = new Intersection Observer((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    revealTargets.forEach(target => revealObserver.observe(target));
});