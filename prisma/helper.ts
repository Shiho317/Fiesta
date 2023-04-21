export const cardElegant = {
  html: `
  <html>
    <body>
      <div style="display:flex;align-items:center;justify-content:center;width:100%;">
        <div style="background:#f5f3ff;min-width:320px;width:400px;padding:15px;">
          <h1 style="text-align:center;font-family:system-ui;">YOU ARE INVITED</h1>
          <div style="font-family:math;">
            <h3 style="text-align:center;">{{eventName}}</h3>
            <h4 style="text-align:center;text-decoration:underline;">{{eventDate}}</h4>
            <p style="text-align:center;">{{eventTime}}</p>
            <p style="text-align:center;">{{eventVenue}}</p>
            <p style="text-align:center;">*Please confirm your attendance.</p>
          </div>
          <div style="display:flex;justify-content:center;gap:40px;">
            <a href={{decline}} target="_blank">
              <button style="padding:10px 15px;background:#d1d5db;border:none;cursor:pointer;border-radius:2px;font-family:system-ui;">Not Attending</button>
            </a>
            <a href={{attend}} target="_blank">
            <button style="padding:10px 15px;background:#c4b5fd;border:none;cursor:pointer;border-radius:2px;font-family:system-ui;">Attending</button>
            </a>
          </div>
          <div style="display:flex;justify-content:center;margin-top:20px;">
            <p style="font-family:math;font-size:14px;color:gray;">Hosted by {{user}}</p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `,
  text: `YOU ARE INVITED \n\n {{eventName}} \n\n {{eventDate}}\n{{eventTime}} \n\n {{eventVenue}} \n\n *Please confirm your attendance. \n\n Attending: {{attend}} \n Not Attending: {{decline}} \n\n Hosted by {{user}}`,
  name: "elegant",
};

export const cardSimple = {
  html: `
  <html>
    <body>
      <div style="display:flex;align-items:center;justify-content:center;width:100%;">
        <div style="min-width:320px;width:400px;padding:15px;border-radius:10px;border:5px double black;">
          <h1 style="text-align:center;font-family:cursive;">Invitation</h1>
          <div style="font-family:serif;">
            <h3 style="text-align:center;">{{eventName}}</h3>
            <h4 style="text-align:center;text-decoration:underline;">{{eventDate}}</h4>
            <p style="text-align:center;">{{eventTime}}</p>
            <p style="text-align:center;">{{eventVenue}}</p>
            <p style="text-align:center;">*Please confirm your attendance.</p>
          </div>
          <div style="display:flex;justify-content:center;gap:40px;">
            <a href={{decline}} target="_blank">
              <button style="padding:10px 15px;background:#d1d5db;border:none;cursor:pointer;border-radius:2px;font-family:serif;">Not Attending</button>
            </a>
            <a href={{attend}} target="_blank">
              <button style="padding:10px 15px;background:#c4b5fd;border:none;cursor:pointer;border-radius:2px;font-family:serif;">Attending</button>
            </a>
          </div>
          <div style="display:flex;justify-content:center;margin-top:20px;">
            <p style="font-family:serif;font-size:14px;color:gray;">Hosted by {{user}}</p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `,
  text: `Invitation \n\n {{eventName}} \n\n {{eventDate}}\n{{eventTime}} \n\n {{eventVenue}} \n\n *Please confirm your attendance. \n\n Attending: {{attend}} \n Not Attending: {{decline}} \n\n Hosted by {{user}}`,
  name: "simple",
};

export const cardClassy = {
  html: `
  <html>
    <body>
      <div style="display:flex;align-items:center;justify-content:center;width:100%;">
        <div style="min-width:320px;width:400px;padding:15px;border-radius:10px;border:5px solid #ddd6fe;">
          <h1 style="text-align:center;font-family:system-ui;">You Are Invited</h1>
          <div style="font-family:system-ui;">
            <h3 style="text-align:center;">{{eventName}}</h3>
            <h4 style="text-align:center;text-decoration:underline;">{{eventDate}}</h4>
            <p style="text-align:center;">{{eventTime}}</p>
            <p style="text-align:center;">{{eventVenue}}</p>
            <p style="text-align:center;">*Please confirm your attendance.</p>
          </div>
          <div style="display:flex;justify-content:center;gap:40px;">
            <a href={{decline}} target="_blank">
              <button style="padding:10px 15px;background:#d1d5db;border:none;cursor:pointer;border-radius:2px;font-family:system-ui;">Not Attending</button>
            </a>
            <a href={{attend}} target="_blank">
              <button style="padding:10px 15px;background:#c4b5fd;border:none;cursor:pointer;border-radius:2px;font-family:system-ui;">Attending</button>
            </a>
          </div>
          <div style="display:flex;justify-content:center;margin-top:20px;">
            <p style="font-family:system-ui;font-size:14px;color:gray;">Hosted by {{user}}</p>
          </div>
        </div>
      </div>
    </body>
  </html>
  `,
  text: `You Are Invited \n\n {{eventName}} \n\n {{eventDate}}\n{{eventTime}} \n\n {{eventVenue}} \n\n *Please confirm your attendance. \n\n Attending: {{attend}} \n Not Attending: {{decline}} \n\n Hosted by {{user}}`,
  name: "classy",
};
