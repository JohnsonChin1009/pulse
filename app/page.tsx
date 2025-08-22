import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero";
import { AboutSection } from "@/components/landing/about";
import { HowItWorksSection } from "@/components/landing/how-it-works";
import { TeamSection } from "@/components/landing/team";
import { VisionMissionSection } from "@/components/landing/vision-mission";
import { Footer } from "@/components/landing/footer";
import BottomBanner from "@/components/landing/bottom-banner";
import AnimateOnView from "@/components/landing/animation";
import { generateToken } from "@/lib/mockJwt";


export default async function LandingPage() {
  const token = await generateToken(
    "5731feeb-05cd-4427-9080-ad366bad1fa6",
    "sohjs.work@gmail.com",
    "admin"
  );

  console.log("Mock JWT: " + token);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <AnimateOnView animation="slideDown">
          <HeroSection />
        </AnimateOnView>

        <AnimateOnView animation="slideLeft">
          <AboutSection />
        </AnimateOnView>

        <AnimateOnView animation="slideRight">
          <HowItWorksSection />
        </AnimateOnView>

        <AnimateOnView animation="slideDown">
          <TeamSection />
        </AnimateOnView>

        <AnimateOnView animation="slideUp">
          <VisionMissionSection />
        </AnimateOnView>

        <AnimateOnView animation="fadeIn" duration={2}>
          <BottomBanner />
        </AnimateOnView>
      </main>
      <AnimateOnView animation="slideUp">
        <Footer />
      </AnimateOnView>
    </div>
  );
}
