import BasicCard from "@/components/basic-card";
import UploadForm from "@/components/product-upload-form";

const Upload = () => {
  return (
    // container classes centered
    <div className="flex flex-col items-center justify-center h-screen">
      <BasicCard title="Upload Product" description="Upload a product to the Hedera network">
        <UploadForm />
      </BasicCard>
    </div>
  );
};

export default Upload;
