import web3 from './web3.js';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    JSON.parse(CampaignFactory.interface),
    // '0x07eb6853aF0ff65dfee058F41D6CCD4f1384f09f'
    '0x4ebC602C7CC70972114D74eFCD42bf04EfBD78F1'
)

export default instance;