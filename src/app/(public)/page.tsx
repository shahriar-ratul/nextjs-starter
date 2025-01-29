import Contact from '@/modules/front/Contact';
import Faq from '@/modules/front/Faq';
import Feature from '@/modules/front/Feature';
import Hero from '@/modules/front/Hero';
import HomeBlog from '@/modules/front/HomeBlog';
import Pricing from '@/modules/front/Pricing';
import Stats from '@/modules/front/Stats';
import Testimonials from '@/modules/front/Testimonials';
export default function Home() {
	return (
		<>
			<Hero />
			<Stats />
			<Feature />
			<Pricing />
			<HomeBlog />
			<Faq />
			<Testimonials />
			<Contact />
		</>
	);
}
