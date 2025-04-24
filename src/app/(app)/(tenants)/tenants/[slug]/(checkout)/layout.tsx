import { Navbar } from "@/modules/checkout/ui/components/navbar";
import { Footer } from "@/modules/tenants/ui/components/footer";

interface TenantCheckoutLayoutProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

const TenantCheckoutLayout = async ({
  params,
  children,
}: TenantCheckoutLayoutProps) => {
  const { slug } = await params;

  return (
    <div className="min-h-screen bg-[#F4F4F0] flex flex-col">
      <Navbar slug={slug} />
      <div className="flex-1">
        <div className="max-w-(--breakpoint-xl) mx-auto">{children}</div>
      </div>
      <Footer />
    </div>
  );
};

export default TenantCheckoutLayout;
