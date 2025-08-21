import UserModel from "@/resources/user/user.model";

interface AdminData {
  name: string;
  email: string;
  password: string;
  role: string;
}

const createAdmin = async (): Promise<void> => {
  try {
    const admin = await UserModel.findOne({ email: "admin@docketrun.com" });

    if (!admin) {
      const adminData: AdminData = {
        name: "DocketRun",
        email: "admin@docketrun.com",
        password: "DocketRun@944",
        role: "ADMIN",
      };

      const newAdmin = new UserModel(adminData);
      await newAdmin.save();
      console.log("Admin created");
    } else {
      console.log("Admin exists");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  }
};

export default createAdmin;
