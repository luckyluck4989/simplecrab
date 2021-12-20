import Web3 from "web3";

const toTimeFormat = (data) => {
	let date = new Date(data * 1000);
	return date.getFullYear() + '/' + parseInt(date.getUTCMonth() + 1) + '/' + date.getDate() + ' ' + date.toTimeString().split(' ')[0];
}

const addComma = (string) => {
	return string.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const getWeb3 = () =>
	new Promise(async (resolve, reject) => {
		// Modern dapp browsers...
		if (window.ethereum) {
			const web3 = new Web3(window.ethereum);
			try {
				// Request account access if needed
				await window.ethereum.enable();
				// Accounts now exposed
				resolve(web3);
			} catch (error) {
				reject(error);
			}
		} else if (window.web3) { // Legacy dapp browsers...

			// Use Mist/MetaMask's provider.
			const web3 = window.web3;
			resolve(web3);

		} else { // Fallback to localhost; use dev console port by default...
			const provider = new Web3.providers.HttpProvider("http://127.0.0.1:7545");
			const web3 = new Web3(provider);
			resolve(web3);
		}
});


export {
	toTimeFormat,
	getWeb3,
	addComma
};

