import { spawn } from 'cross-spawn';

export default {
	name: `build-compiler`,
	buildStart: () =>
		new Promise((resolve, reject) => {
			const child = spawn(`npm`, [`run`, `build`]);

			child.stdout.on('data', data => {
				process.stdout.write(data.toString());
			});
			child.stderr.on('data', data => {
				process.stdout.write(data.toString());
			});

			child.on('close', code => {
				if (code) reject();
				else resolve();
			});
		}),
};
