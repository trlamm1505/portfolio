import mongoose, { ConnectOptions } from "mongoose";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");
try {
   dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {}

interface Connection {
   connected?: number;
}

const connection: Connection = {};

const MongooseClient = async (): Promise<void> => {
   try {
      if (connection.connected) return;

      let uri = process.env.MONGODB_URI as string;
      const user = process.env.MONGODB_USER as string;
      const pass = process.env.MONGODB_PASSWORD as string;

      if (uri && uri.includes("<db_password>") && pass) {
         uri = uri.replace("<db_password>", encodeURIComponent(pass));
      }

      const db = await mongoose.connect(uri);

      // console.log(db);

      connection.connected = db.connections[0].readyState;

      // Kiểm tra trạng thái kết nối và log ra thông báo tương ứng
      switch (mongoose.connection.readyState) {
         case 0:
            console.log("Kết nối với MongoDB đang được thiết lập...");
            break;
         case 1:
            console.log("Kết nối với MongoDB đã thành công!");
            break;
         case 2:
            console.log("Kết nối với MongoDB đang được đóng lại...");
            break;
         case 3:
            console.log("Kết nối với MongoDB đã đóng!");
            break;
      }
   } catch (err) {
      throw new Error(err as string);
   }
};

export default MongooseClient;
