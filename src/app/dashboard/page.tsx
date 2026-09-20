import { LayoutContainer  } from '@/shared/ui/components';
import { Title  } from '@/shared/ui/components';

export default function DashboardPage() {
  return (
    <LayoutContainer className="min-h-screen w-full flex items-center justify-center bg-[#111111] text-white">
      <Title level="h1" className="text-3xl font-bold">
        Bem-vindo ao Dashboard!
      </Title>
    </LayoutContainer>
  );
}
