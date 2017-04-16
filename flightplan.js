const plan = require('flightplan');

plan.target('production',
  [
    {
      host: '172.25.76.33',
      username: 'collab',
      agent: process.env.SSH_AUTH_SOCK,
    },
  ],
  {
    dir: '/home/sadm/NUSCollab/collab',
    branch: 'origin/master',
  }
);

plan.remote((remote) => {
  remote.log('Fetching all remote branches');
  remote.sudo(`cd ${plan.runtime.options.dir} && git fetch --all`);

  remote.log(`Checking out ${plan.runtime.options.branch}`);
  remote.sudo(`cd ${plan.runtime.options.dir} && git checkout ${plan.runtime.options.branch}`);

  remote.log('Installing dependencies');
  remote.sudo(`cd ${plan.runtime.options.dir} && npm install`);

  remote.log('Gracefully reload application');
  remote.sudo('pm2 gracefulReload collab');
});
