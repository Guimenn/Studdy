'use client';

import PlataformasAprendizagem from './componentes/plataformas';
import Overview from './componentes/overview';
import Welcome from './componentes/welcome';
import Results from './componentes/results';

export default function Dashboard() {
	return (
		<div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100">
			{/* Main Content */}
			<div className="flex flex-col flex-1 overflow-hidden">
				{/* Main Content Area */}
				<div className="flex-1 overflow-auto p-6">
					<div className="max-w-7xl mx-auto">

						<Welcome />
						<Overview />
						<PlataformasAprendizagem />
						<Results />
						
					</div>
				</div>
			</div>
		</div>
	);
}
