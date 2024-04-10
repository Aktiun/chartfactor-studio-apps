const getPrice = (price, minimum_nights) => {
    price = parseFloat(price);
    if (price > 0) {
       return `$${price}/night, ${minimum_nights} night min`;
    } else {
        return 'Price not available';
    }
}

const getStars = (rating) => {
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (rating > i) {
            stars += '<i class="star-icon">★</i>';
        } else {
            stars += '<i class="star-icon">☆</i>';
        }
    }
    return stars;
}

// box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
const getTooltipCardHtml = (data) => {
    let template = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      .tooltip-card {
        font-family: 'Arial', sans-serif;
        border-radius: 4px;
        background-color: #fff;
        width: 200px;
        max-height: 300px;
        overflow: hidden;
      }
      .tooltip-card img {
        width: 100%;
        max-height: 100px;
        display: block;
        border-bottom: 1px solid #eaeaea;
      }
      .tooltip-card-content {
        padding: 8px;
      }
      .tooltip-card-title {
        font-weight: bold;
        font-size: 12px;
        margin-bottom: 4px;
      }
      .tooltip-card-price {
        color: #333;
        font-size: 10px;
        margin-bottom: 2px;
      }
      .tooltip-card-reviews {
        font-size: 10px;
        color: #666;
        margin-bottom: 4px;
      }
      .tooltip-card-rating {
        display: flex;
        align-items: center;
      }
      .tooltip-card-rating i {
        color: #FFD700; /* gold color for stars */
      }
    </style>
    </head>
    <body>
    
    <div class="tooltip-card">
      <img src="{{imageUrl}}" alt="Property Image">
      <div class="tooltip-card-content">
        <div class="tooltip-card-title">{{name}}</div>
        <div class="tooltip-card-price">{{price}}</div>
        <div class="tooltip-card-reviews">{{reviews}} reviews</div>
        <div class="tooltip-card-rating">
          {{stars}}
        </div>
      </div>
    </div>
    
    </body>
    </html>
    `;
    template = template.replace("{{imageUrl}}", data[6].value);
    template = template.replace("{{name}}", `${data[1].value} by ${data[12].value}`);
    template = template.replace("{{price}}", getPrice(data[5].value, data[9].value));
    template = template.replace("{{reviews}}", data[7].value);
    template = template.replace("{{stars}}", getStars(data[8].value));

    return template;
    }
