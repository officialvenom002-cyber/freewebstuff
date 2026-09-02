import { Resource, Category, Collection } from "../types";

export function generateResourceSchema(resource: Resource, baseUrl = "https://freewebstuff.site") {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: resource.name,
    headline: resource.tagline,
    description: resource.description,
    url: `${baseUrl}/resource/${resource.slug}`,
    sameAs: resource.url,
    applicationCategory: resource.categoryId,
    operatingSystem: resource.platforms.join(", "),
    offers: {
      "@type": "Offer",
      price: resource.pricingType === "free" || resource.pricingType === "open-source" ? "0" : undefined,
      priceCurrency: "USD",
      category: resource.pricingType,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: resource.communityRating,
      ratingCount: resource.reviewCount,
      bestRating: "5",
      worstRating: "1",
    },
  };
}

export function generateCollectionSchema(collection: Collection, resources: Resource[], baseUrl = "https://freewebstuff.site") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    description: collection.description,
    url: `${baseUrl}/collections/${collection.slug}`,
    numberOfItems: resources.length,
    itemListElement: resources.map((res, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: res.name,
      url: `${baseUrl}/resource/${res.slug}`,
    })),
  };
}

export function generateCategorySchema(category: Category, resourceCount: number, baseUrl = "https://freewebstuff.site") {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.name} Tools & Resources`,
    description: category.description,
    url: `${baseUrl}/categories/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: resourceCount,
    },
  };
}

export function generateWebSiteSchema(baseUrl = "https://freewebstuff.site") {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "FreeWebStuff",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
