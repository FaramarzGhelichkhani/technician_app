import { getLoginData } from "./Async";
import { Buffer } from "buffer";
import {API_URL} from "@env"

const HOST = API_URL
const VALIDATE_CREDENTIALS_URL = HOST + 'agents/credentials/';


export async function validate_credentials(phoneNumber, password) {
    // Validate phone number and password
    // ...
    try {
        const response = await fetch(VALIDATE_CREDENTIALS_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phone: phoneNumber,
                password: password
            })
        });

        //   if (!response.ok) {
        //     throw new Error('Invalid credentials');
        //   }
        const data = await response.json();

        // Login successful
        return { success: data.success, message: data.message, token : data.token };
    } catch (error) {
        //   // Login failed
        return { success: false, message: error.message };
    }
}


export  async  function Fetch_data(url) {
    // Validate phone number and password
    const Logindata = await getLoginData();
    const username = Logindata.username;
    const password = Logindata.password;
    const token = Logindata.token;
    const URLS = {
        'ORDERS_URL' : HOST + 'leads/orders/',
        'ORDERS_URL_ONGOING' : HOST + 'leads/orders/ongoing/',
        'ORDERS_URL_RECOMMENDATIONS' : HOST + 'leads/orders/recommendations/',
        'ORDERS_STATS': HOST + 'leads/orders/stats/',
        // 
        'TRANSACTION_LIST':HOST + 'transactions/app/',
        //
        'SERVICES_LIST':HOST + 'emdad/services/',
        //
        'MOTORS_LIST':HOST + 'emdad/motors/',
        //
        'PRODUCTS_LIST':HOST +'emdad/products/',
        //
        'USER_INFO':HOST + 'agents/userinfo/',
    }
    
    const authHeader = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

    try {
        const response =  await fetch(URLS[url], {
            method: 'GET',
            withCredentials: true,
            credentials: 'same-origin',
            headers: {
                'Authorization': `Token ${token}`,
                // Authorization: `Basic ${authHeader}`,
                'Content-Type': 'application/json',
              },
        });

        //   if (!response.ok) {
        //     throw new Error('Invalid credentials');
        //   }
        const data = await  response.json();

        // Login successful
        return { success: true, data: data };
    } catch (error) {
        //   // Login failed
        return {success: false, message: error.message };
    }
}



export  async  function order_detail(id) {
    // Validate phone number and password
    const Logindata = await getLoginData();
    const username = Logindata.username;
    const password = Logindata.password;
    const authHeader = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');

// 
    const URL = HOST + 'leads/orders/' + String(id)
    try {
        const response =  await fetch(URL, {
            method: 'GET',
            headers: {
                Authorization: `Basic ${authHeader}`,
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({
            //     phone: Logindata.username,
            //     password: Logindata.password
            // })
        });

        //   if (!response.ok) {
        //     throw new Error('Invalid credentials');
        //   }
        const data = await  response.json();

        // Login successful
        return { success: true, data: data[0] };
    } catch (error) {
        //   // Login failed
        return {success: false, message: error.message };
    }
}


export  async  function order_product_detail(id) {
    // Validate phone number and password
    const Logindata = await getLoginData();
// 
    const URL = HOST + 'leads/orders/' + String(id) + '/order_products/'
    try {
        const response =  await fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({
            //     phone: Logindata.username,
            //     password: Logindata.password
            // })
        });

        //   if (!response.ok) {
        //     throw new Error('Invalid credentials');
        //   }
        const data = await  response.json();

        // Login successful
        return { success: true, data: data };
    } catch (error) {
        //   // Login failed
        return {success: false, message: error.message };
    }
}

export  async  function update_order(id,data) {
    // Validate phone number and password
    const Logindata = await getLoginData();
    const username = Logindata.username;
    const password = Logindata.password;
    const authHeader = Buffer.from(`${username}:${password}`, 'utf-8').toString('base64');
// 
    const URL = HOST + 'leads/orders/' + String(id) +'/update/'
    try {
        const response =  await fetch(URL, {
            method: 'PUT',
            headers: {
                Authorization: `Basic ${authHeader}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
                // phone: Logindata.username,
                // password: Logindata.password
            // })
        });
        
        //   if (!response.ok) {
        //     throw new Error('Invalid credentials');
        //   }
        const updated_data = await  response.json();
        // Login successful
        return { success: true, data: updated_data[0] };
    } catch (error) {
        //   // Login failed
       
        return {success: false, message: error.message };
    }
}

export  async  function update_order_product(id,data) {
    // Validate phone number and password
    const Logindata = await getLoginData();
// 
    const URL = HOST + 'leads/orders/' + String(id) +'/order_products/bulk/'
    try {
        const response =  await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
                // phone: Logindata.username,
                // password: Logindata.password
            // })
        });

        //   if (!response.ok) {
        //     throw new Error('Invalid credentials');
        //   }
        const updated_data = await  response.json();

        // Login successful
        return { success: true, data: updated_data };
    } catch (error) {
        //   // Login failed
        return {success: false, message: error.message };
    }
}

export  async  function accept_order(id) {
    // Validate phone number and password
    // const Logindata = await getLoginData();
   // 
    const URL = HOST + 'leads/orders/' + String(id) + '/accept/'
    try {
        const response =  await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                technecian_id: 1
            })
        });

        //   if (!response.ok) {
        //     throw new Error('Invalid credentials');
        //   }
        const data = await  response.json();

        // Login successful
        return { success: response.ok, data: data };
    } catch (error) {
        //   // Login failed
        return {success: false, message: error.message };
    }
}