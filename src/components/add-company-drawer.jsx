import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { addNewCompany } from "@/api/apiCompanies";
import { BarLoader } from "react-spinners";
import { useEffect } from "react";
import { Building2, Plus } from "lucide-react";

const schema = z.object({
  name: z.string().min(1, { message: "Company name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" ||
          file[0].type === "image/jpeg" ||
          file[0].type === "image/jpg"),
      { message: "Only Images are allowed" }
    ),
});

const AddCompanyDrawer = ({ fetchCompanies }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddCompany,
    error: errorAddCompany,
    data: dataAddCompany,
    fn: fnAddCompany,
  } = useFetch(addNewCompany);

  const onSubmit = async (data) => {
    fnAddCompany({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddCompany?.length > 0) {
      fetchCompanies();
      reset();
    }
  }, [loadingAddCompany]);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button 
          type="button" 
          size="sm" 
          variant="outline"
          className="glass-card border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Company
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-[#0a0118] border-purple-500/30">
        <DrawerHeader>
          <DrawerTitle className="text-white flex items-center gap-2 text-2xl">
            <Building2 className="w-6 h-6 text-purple-400" />
            Add a New Company
          </DrawerTitle>
          <DrawerDescription className="text-gray-400">
            Add a new company to the platform
          </DrawerDescription>
        </DrawerHeader>

        <form className="flex gap-4 p-4 pb-0 flex-col">
          {/* Company Name */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Company Name
            </label>
            <Input
              placeholder="e.g. Netflix"
              {...register("name")}
              className="glass-card border-purple-500/30 text-white placeholder:text-gray-500 h-12"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <span>⚠</span> {errors.name.message}
              </p>
            )}
          </div>

          {/* Company Logo */}
          <div>
            <label className="text-white text-sm font-semibold mb-2 block">
              Company Logo
            </label>
            <Input
              type="file"
              accept="image/*"
              {...register("logo")}
              className="glass-card border-purple-500/30 text-white file:text-white file:bg-purple-500/20 file:border-0 file:mr-4 file:py-2 file:px-4 file:rounded-lg h-12"
            />
            {errors.logo && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <span>⚠</span> {errors.logo.message}
              </p>
            )}
          </div>

          {/* Error Message */}
          {errorAddCompany?.message && (
            <div className="glass-card border-red-500/30 bg-red-500/10 p-4 rounded-xl">
              <p className="text-red-400 text-sm flex items-center gap-2">
                <span>⚠</span> {errorAddCompany?.message}
              </p>
            </div>
          )}

          {/* Loading State */}
          {loadingAddCompany && <BarLoader width={"100%"} color="#8b5cf6" />}

          <DrawerFooter className="px-0">
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              className="gradient-button h-12 text-base font-semibold rounded-xl"
              disabled={loadingAddCompany}
            >
              <Plus className="w-4 h-4 mr-2" />
              {loadingAddCompany ? "Adding..." : "Add Company"}
            </Button>
            <DrawerClose asChild>
              <Button 
                type="button" 
                variant="outline"
                className="glass-card border-purple-500/30 hover:border-purple-500/50 hover:bg-purple-500/10 text-white h-12 rounded-xl"
              >
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default AddCompanyDrawer;